import React, { useState, useCallback } from 'react';
import EmployeeTable from '../components/Employees/EmployeeTable';
import EmployeeForm from '../components/Employees/EmployeeForm';
import Toast from '../components/common/Toast';
import { Employee } from '../types';
import './EmployeesPage.css';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

const EmployeesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  }, []);

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

  const handleFormSuccess = (action: 'created' | 'updated') => {
    setShowForm(false);
    setEditingEmployee(null);
    setRefreshKey(k => k + 1);
    showToast(action === 'created' ? 'Employee added successfully' : 'Employee updated successfully');
  };

  const handleDeleteSuccess = () => {
    showToast('Employee deleted successfully');
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
        onDeleteSuccess={handleDeleteSuccess}
      />

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default EmployeesPage;