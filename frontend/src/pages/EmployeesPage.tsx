import React, { useState } from 'react';
import EmployeeTable from '../components/Employees/EmployeeTable';
import EmployeeForm from '../components/Employees/EmployeeForm';
import { Employee } from '../types';
import './EmployeesPage.css';

const EmployeesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEmployee(null);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">All employees</h1>
          <p className="page-sub">Manage your organization's workforce</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          + Add employee
        </button>
      </div>

      <EmployeeTable
        key={refreshKey}
        onEdit={handleEdit}
      />

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default EmployeesPage;