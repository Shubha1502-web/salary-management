import React, { useState, useEffect } from 'react';
import { getEmployees, deleteEmployee } from '../../api/employees';
import { Employee } from '../../types';
import './EmployeeTable.css';

interface Props {
  onEdit: (employee: Employee) => void;
}

const COUNTRIES = ['', 'India', 'USA', 'UK', 'Germany', 'Canada'];
const JOB_TITLES = ['', 'Engineer', 'Senior Engineer', 'Manager', 'Director', 'Designer', 'Analyst', 'Product Manager'];
const PAGE_SIZE = 20;

const EmployeeTable: React.FC<Props> = ({ onEdit }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadEmployees();
  }, [page, country, jobTitle]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadEmployees();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees({ page, pageSize: PAGE_SIZE, country: country || undefined, jobTitle: jobTitle || undefined, search: search || undefined });
      setEmployees(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setDeletingId(id);
    try {
      await deleteEmployee(id);
      loadEmployees();
    } catch (err) {
      alert('Failed to delete employee');
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="table-container">
      <div className="table-filters">
        <input
          className="search-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="filter-select" value={country} onChange={e => { setCountry(e.target.value); setPage(1); }}>
          {COUNTRIES.map(c => <option key={c} value={c}>{c || 'All countries'}</option>)}
        </select>
        <select className="filter-select" value={jobTitle} onChange={e => { setJobTitle(e.target.value); setPage(1); }}>
          {JOB_TITLES.map(j => <option key={j} value={j}>{j || 'All job titles'}</option>)}
        </select>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="table-loading">Loading...</div>
        ) : (
          <table className="emp-table">
            <thead>
              <tr>
                <th>Full name</th>
                <th>Job title</th>
                <th>Department</th>
                <th>Country</th>
                <th>Salary</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="emp-name">{emp.fullName}</div>
                    <div className="emp-email">{emp.email}</div>
                  </td>
                  <td>{emp.jobTitle}</td>
                  <td>{emp.department}</td>
                  <td><span className="badge badge-blue">{emp.country}</span></td>
                  <td className="emp-salary">{fmt(emp.salary)}</td>
                  <td>
                    <span className={`badge ${emp.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
                      {emp.status === 'active' ? 'Active' : 'On leave'}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button className="action-btn" onClick={() => onEdit(emp)} title="Edit">✏️</button>
                    <button
                      className="action-btn danger"
                      onClick={() => handleDelete(emp.id)}
                      disabled={deletingId === emp.id}
                      title="Delete"
                    >🗑️</button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan={7} className="empty-row">No employees found</td></tr>
              )}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <span className="pagination-info">
            Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()}
          </span>
          <div className="pagination-btns">
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>←</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
                  {p}
                </button>
              );
            })}
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;