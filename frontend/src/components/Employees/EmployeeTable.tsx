import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GridSortModel } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { getEmployees, getAllEmployeesForExport, deleteEmployee } from '../../api/employees';
import { Employee } from '../../types';
import EmployeeDataGrid from './EmployeeDataGrid';
import './EmployeeTable.css';

interface Props {
  onEdit: (employee: Employee) => void;
  onDeleteSuccess: () => void;
}

const STATUS_LABELS: Record<string, string> = { active: 'Active', on_leave: 'On leave' };
const COUNTRY_OPTIONS = ['India', 'USA', 'UK', 'Germany', 'Canada'];
const JOB_TITLE_OPTIONS = ['Engineer', 'Senior Engineer', 'Manager', 'Director', 'Designer', 'Analyst', 'Product Manager'];
const STATUS_OPTIONS = ['active', 'on_leave'];

interface FilterDropdownProps {
  options: string[];
  labelMap?: Record<string, string>;
  selected: string[];
  onChange: (selected: string[]) => void;
  onClose: () => void;
  searchPlaceholder: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options, labelMap, selected, onChange, onClose, searchPlaceholder,
}) => {
  const [search, setSearch] = useState('');
  const [local, setLocal] = useState<string[]>(selected);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const filtered = options.filter(o =>
    (labelMap?.[o] || o).toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (val: string) => {
    setLocal(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const toggleAll = () => {
    setLocal(local.length === options.length ? [] : [...options]);
  };

  return (
    <div className="filter-dropdown" ref={ref}>
      <input
        className="filter-dropdown-search"
        placeholder={searchPlaceholder}
        value={search}
        onChange={e => setSearch(e.target.value)}
        autoFocus
      />
      <div className="filter-dropdown-list">
        <label className="filter-dropdown-item">
          <input type="checkbox" checked={local.length === options.length} onChange={toggleAll} />
          <span>Select All</span>
        </label>
        {filtered.map(opt => (
          <label key={opt} className="filter-dropdown-item">
            <input type="checkbox" checked={local.includes(opt)} onChange={() => toggle(opt)} />
            <span>{labelMap?.[opt] || opt}</span>
          </label>
        ))}
      </div>
      <div className="filter-dropdown-footer">
        <button className="filter-btn-reset" onClick={() => { setLocal([]); onChange([]); onClose(); }}>
          Reset
        </button>
        <button className="filter-btn-apply" onClick={() => { onChange(local); onClose(); }}>
          Apply
        </button>
      </div>
    </div>
  );
};

const EmployeeTable: React.FC<Props> = ({ onEdit, onDeleteSuccess }) => {
  const [rows, setRows] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [openFilter, setOpenFilter] = useState<'country' | 'jobTitle' | 'status' | null>(null);
  const [filterAnchor, setFilterAnchor] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async (
    pg: number, ps: number, s: string,
    countries: string[], jobTitles: string[],
    statuses: string[], sm: GridSortModel
  ) => {
    setLoading(true);
    try {
      const res = await getEmployees({
        page: pg + 1,
        pageSize: ps,
        search: s || undefined,
        country: countries.length === 1 ? countries[0] : undefined,
        jobTitle: jobTitles.length === 1 ? jobTitles[0] : undefined,
        status: statuses.length === 1 ? statuses[0] : undefined,
        sortField: sm[0]?.field,
        sortOrder: sm[0]?.sort ?? 'asc',
      });
      setRows(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(page, pageSize, search, selectedCountries, selectedJobTitles, selectedStatuses, sortModel);
    }, 300);
    return () => clearTimeout(timer);
  }, [page, pageSize, search, selectedCountries, selectedJobTitles, selectedStatuses, sortModel]);

  const openFilterDropdown = (field: 'country' | 'jobTitle' | 'status', e: React.MouseEvent) => {
    e.stopPropagation();
    const btn = e.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    setFilterAnchor({
      top: rect.bottom - (containerRect?.top || 0) + 4,
      left: rect.left - (containerRect?.left || 0),
    });
    setOpenFilter(prev => prev === field ? null : field);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await deleteEmployee(id);
      onDeleteSuccess();
      loadData(page, pageSize, search, selectedCountries, selectedJobTitles, selectedStatuses, sortModel);
    } catch {
      alert('Failed to delete employee');
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await getAllEmployeesForExport({
        search: search || undefined,
        country: selectedCountries.length === 1 ? selectedCountries[0] : undefined,
        jobTitle: selectedJobTitles.length === 1 ? selectedJobTitles[0] : undefined,
        sortField: sortModel[0]?.field,
        sortOrder: sortModel[0]?.sort ?? 'asc',
      });
      const data = res.data.data;
      const headers = ['ID', 'Full Name', 'Job Title', 'Department', 'Country', 'Salary', 'Email', 'Status'];
      const csvRows = [
        headers.join(','),
        ...data.map(e =>
          [e.id, `"${e.fullName}"`, `"${e.jobTitle}"`, `"${e.department}"`,
            e.country, e.salary, e.email, e.status].join(',')
        ),
      ];
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="table-wrapper" ref={containerRef}>
      <div className="table-toolbar">
        <div className="search-wrap">
          <SearchIcon className="search-icon" />
          <input
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
          />
        </div>
        <div className="toolbar-right">
          {selectedCountries.length > 0 && (
            <span className="active-filter-tag">
              Country: {selectedCountries.join(', ')}
              <button onClick={() => { setSelectedCountries([]); setPage(0); }}>✕</button>
            </span>
          )}
          {selectedJobTitles.length > 0 && (
            <span className="active-filter-tag">
              Title: {selectedJobTitles.join(', ')}
              <button onClick={() => { setSelectedJobTitles([]); setPage(0); }}>✕</button>
            </span>
          )}
          {selectedStatuses.length > 0 && (
            <span className="active-filter-tag">
              Status: {selectedStatuses.map(s => STATUS_LABELS[s]).join(', ')}
              <button onClick={() => { setSelectedStatuses([]); setPage(0); }}>✕</button>
            </span>
          )}
          <button className="btn-export" onClick={handleExportCSV} disabled={exporting}>
            <FileDownloadIcon style={{ fontSize: 16 }} />
            {exporting ? 'Exporting...' : 'CSV'}
          </button>
        </div>
      </div>

      <EmployeeDataGrid
        rows={rows}
        total={total}
        page={page}
        pageSize={pageSize}
        loading={loading}
        sortModel={sortModel}
        selectedCountries={selectedCountries}
        selectedJobTitles={selectedJobTitles}
        selectedStatuses={selectedStatuses}
        onPageChange={(p, ps) => { setPage(p); setPageSize(ps); }}
        onSortChange={setSortModel}
        onFilterClick={openFilterDropdown}
        onEdit={onEdit}
        onDelete={handleDelete}
      />

      {openFilter === 'country' && filterAnchor && (
        <div style={{ position: 'absolute', top: filterAnchor.top, left: filterAnchor.left, zIndex: 1000 }}>
          <FilterDropdown
            options={COUNTRY_OPTIONS}
            selected={selectedCountries}
            onChange={v => { setSelectedCountries(v); setPage(0); }}
            onClose={() => setOpenFilter(null)}
            searchPlaceholder="Search countries..."
          />
        </div>
      )}

      {openFilter === 'jobTitle' && filterAnchor && (
        <div style={{ position: 'absolute', top: filterAnchor.top, left: filterAnchor.left, zIndex: 1000 }}>
          <FilterDropdown
            options={JOB_TITLE_OPTIONS}
            selected={selectedJobTitles}
            onChange={v => { setSelectedJobTitles(v); setPage(0); }}
            onClose={() => setOpenFilter(null)}
            searchPlaceholder="Search job titles..."
          />
        </div>
      )}

      {openFilter === 'status' && filterAnchor && (
        <div style={{ position: 'absolute', top: filterAnchor.top, left: filterAnchor.left, zIndex: 1000 }}>
          <FilterDropdown
            options={STATUS_OPTIONS}
            labelMap={STATUS_LABELS}
            selected={selectedStatuses}
            onChange={v => { setSelectedStatuses(v); setPage(0); }}
            onClose={() => setOpenFilter(null)}
            searchPlaceholder="Search status..."
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;