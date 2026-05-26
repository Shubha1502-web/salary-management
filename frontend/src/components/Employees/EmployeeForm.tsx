import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee } from '../../api/employees';
import { Employee } from '../../types';
import './EmployeeForm.css';

interface Props {
  employee: Employee | null;
  onClose: () => void;
  onSuccess: (action: 'created' | 'updated') => void;
}

const COUNTRIES = ['India', 'USA', 'UK', 'Germany', 'Canada'];
const JOB_TITLES = ['Engineer', 'Senior Engineer', 'Manager', 'Director', 'Designer', 'Analyst', 'Product Manager'];
const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Analytics', 'Leadership', 'Marketing', 'HR'];

const EMPTY_FORM = {
  fullName: '',
  jobTitle: 'Engineer',
  department: 'Engineering',
  country: 'India',
  salary: '',
  email: '',
  status: 'active',
};

const EmployeeForm: React.FC<Props> = ({ employee, onClose, onSuccess }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        fullName: employee.fullName,
        jobTitle: employee.jobTitle,
        department: employee.department,
        country: employee.country,
        salary: String(employee.salary),
        email: employee.email,
        status: employee.status,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [employee]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.salary) errs.salary = 'Salary is required';
    else if (isNaN(Number(form.salary)) || Number(form.salary) <= 0) errs.salary = 'Enter a valid salary';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      const data = { ...form, salary: Number(form.salary) };
      if (employee) {
        await updateEmployee(employee.id, data);
        onSuccess('updated');
      } else {
        await createEmployee(data as any);
        onSuccess('created');
      }
    } catch (err) {
      setErrors({ submit: 'Failed to save employee. Email may already exist.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{employee ? 'Edit employee' : 'Add new employee'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {errors.submit && (
            <div className="form-error-banner">{errors.submit}</div>
          )}

          <div className="form-row">
            <div className="form-field">
              <label>Full name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
              />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </div>
            <div className="form-field">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@company.com"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Job title</label>
              <select name="jobTitle" value={form.jobTitle} onChange={handleChange}>
                {JOB_TITLES.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Department</label>
              <select name="department" value={form.department} onChange={handleChange}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Country</label>
              <select name="country" value={form.country} onChange={handleChange}>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Salary (USD)</label>
              <input
                name="salary"
                type="number"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. 85000"
              />
              {errors.salary && <span className="field-error">{errors.salary}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="on_leave">On leave</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : employee ? 'Save changes' : 'Add employee'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;