import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridRenderCellParams,
  GridColumnHeaderParams,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Employee } from '../../types';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

interface FilterBtnProps {
  field: 'country' | 'jobTitle' | 'status';
  selected: string[];
  onClick: (field: 'country' | 'jobTitle' | 'status', e: React.MouseEvent) => void;
}

const FilterBtn: React.FC<FilterBtnProps> = ({ field, selected, onClick }) => (
  <button
    className={`col-filter-btn ${selected.length > 0 ? 'active' : ''}`}
    onClick={e => onClick(field, e)}
  >
    <FilterAltIcon style={{ fontSize: 14 }} />
    {selected.length > 0 && <span className="filter-count">{selected.length}</span>}
  </button>
);

interface Props {
  rows: Employee[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  sortModel: GridSortModel;
  selectedCountries: string[];
  selectedJobTitles: string[];
  selectedStatuses: string[];
  onPageChange: (page: number, pageSize: number) => void;
  onSortChange: (model: GridSortModel) => void;
  onFilterClick: (field: 'country' | 'jobTitle' | 'status', e: React.MouseEvent) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

const FullNameCell: React.FC<{ params: GridRenderCellParams }> = ({ params }) => (
  <div>
    <div className="emp-name">{params.row.fullName}</div>
    <div className="emp-email">{params.row.email}</div>
  </div>
);

const JobTitleCell: React.FC<{ params: GridRenderCellParams }> = ({ params }) => (
  <span>{params.value}</span>
);

const DepartmentCell: React.FC<{ params: GridRenderCellParams }> = ({ params }) => (
  <span>{params.value}</span>
);

const CountryCell: React.FC<{ params: GridRenderCellParams }> = ({ params }) => (
  <span className="badge badge-blue">{params.value}</span>
);

const SalaryCell: React.FC<{ params: GridRenderCellParams }> = ({ params }) => (
  <span className="emp-salary">{fmt(params.value)}</span>
);

const StatusCell: React.FC<{ params: GridRenderCellParams }> = ({ params }) => (
  <span className={`status-chip ${params.value === 'active' ? 'chip-active' : 'chip-leave'}`}>
    {params.value === 'active' ? 'Active' : 'On leave'}
  </span>
);

interface ActionCellProps {
  params: GridRenderCellParams;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

const ActionCell: React.FC<ActionCellProps> = ({ params, onEdit, onDelete }) => (
  <div className="action-cell">
    <button className="action-btn edit" onClick={() => onEdit(params.row)} title="Edit">
      <EditIcon style={{ fontSize: 16 }} />
    </button>
    <button className="action-btn del" onClick={() => onDelete(params.row.id)} title="Delete">
      <DeleteIcon style={{ fontSize: 16 }} />
    </button>
  </div>
);

const ColHeader: React.FC<{ label: string }> = ({ label }) => (
  <div className="col-header">
    <span>{label}</span>
  </div>
);

const ColHeaderWithFilter: React.FC<{
  label: string;
  field: 'country' | 'jobTitle' | 'status';
  selected: string[];
  onFilterClick: (field: 'country' | 'jobTitle' | 'status', e: React.MouseEvent) => void;
}> = ({ label, field, selected, onFilterClick }) => (
  <div className="col-header">
    <span>{label}</span>
    <FilterBtn field={field} selected={selected} onClick={onFilterClick} />
  </div>
);

const EmployeeDataGrid: React.FC<Props> = ({
  rows, total, page, pageSize, loading, sortModel,
  selectedCountries, selectedJobTitles, selectedStatuses,
  onPageChange, onSortChange, onFilterClick, onEdit, onDelete,
}) => {

  const columns: GridColDef[] = [
    {
      field: 'fullName',
      flex: 1.5,
      filterable: false,
      renderHeader: (_p: GridColumnHeaderParams) => (
        <ColHeader label="FULL NAME" />
      ),
      renderCell: (params) => <FullNameCell params={params} />,
    },
    {
      field: 'jobTitle',
      flex: 1,
      filterable: false,
      renderHeader: (_p: GridColumnHeaderParams) => (
        <ColHeaderWithFilter
          label="JOB TITLE"
          field="jobTitle"
          selected={selectedJobTitles}
          onFilterClick={onFilterClick}
        />
      ),
      renderCell: (params) => <JobTitleCell params={params} />,
    },
    {
      field: 'department',
      flex: 1,
      filterable: false,
      renderHeader: (_p: GridColumnHeaderParams) => (
        <ColHeader label="DEPARTMENT" />
      ),
      renderCell: (params) => <DepartmentCell params={params} />,
    },
    {
      field: 'country',
      flex: 0.8,
      filterable: false,
      renderHeader: (_p: GridColumnHeaderParams) => (
        <ColHeaderWithFilter
          label="COUNTRY"
          field="country"
          selected={selectedCountries}
          onFilterClick={onFilterClick}
        />
      ),
      renderCell: (params) => <CountryCell params={params} />,
    },
    {
      field: 'salary',
      flex: 0.9,
      filterable: false,
      renderHeader: (_p: GridColumnHeaderParams) => (
        <ColHeader label="SALARY" />
      ),
      renderCell: (params) => <SalaryCell params={params} />,
    },
    {
      field: 'status',
      flex: 0.8,
      filterable: false,
      sortable: false,
      renderHeader: (_p: GridColumnHeaderParams) => (
        <ColHeaderWithFilter
          label="STATUS"
          field="status"
          selected={selectedStatuses}
          onFilterClick={onFilterClick}
        />
      ),
      renderCell: (params) => <StatusCell params={params} />,
    },
    {
      field: 'actions',
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderHeader: (_p: GridColumnHeaderParams) => (
        <ColHeader label="ACTIONS" />
      ),
      renderCell: (params) => (
        <ActionCell params={params} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];

  return (
    <div className="table-container">
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={total}
        loading={loading}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={m => onPageChange(m.page, m.pageSize)}
        pageSizeOptions={[10, 20, 50]}
        sortModel={sortModel}
        onSortModelChange={onSortChange}
        rowHeight={65}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        sx={{
          border: 'none',
          fontFamily: 'inherit',
          fontSize: '13px',
          height: '100%',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f8faff',
            fontSize: '11px',
            letterSpacing: '0.05em',
            color: '#6b7280',
            fontWeight: 700,
            borderBottom: '1px solid #e5e7eb',
          },
          '& .MuiDataGrid-columnHeader': {
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-columnHeader:focus': { outline: 'none' },
          '& .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
          '& .MuiDataGrid-sortIcon': { color: '#1a56db' },
          '& .MuiDataGrid-cell': {
  borderColor: '#f3f4f6',
  color: '#111827',
  backgroundColor: 'transparent !important',
  display: 'flex',
  alignItems: 'center',
  padding: '0 14px',
},
          '& .MuiDataGrid-cell:focus': { outline: 'none' },
          '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
          '& .MuiDataGrid-row': { backgroundColor: 'transparent !important' },
          '& .MuiDataGrid-row:hover': { backgroundColor: '#f0f7ff !important' },
          '& .MuiDataGrid-row.Mui-selected': { backgroundColor: 'transparent !important' },
          '& .MuiDataGrid-row.Mui-selected:hover': { backgroundColor: '#f0f7ff !important' },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          },
          '& .MuiTablePagination-root': { fontSize: '12px', color: '#6b7280' },
        }}
      />
    </div>
  );
};

export default EmployeeDataGrid;