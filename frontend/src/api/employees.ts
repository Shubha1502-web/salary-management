import axios from 'axios';
import { Employee, PaginatedResponse, SalaryStats, SalaryByTitle } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

export const getEmployees = (params: {
  page: number;
  pageSize: number;
  country?: string;
  jobTitle?: string;
  search?: string;
}) => api.get<PaginatedResponse>('/employees', { params });

export const createEmployee = (data: Omit<Employee, 'id' | 'hiredAt'>) =>
  api.post<Employee>('/employees', data);

export const updateEmployee = (id: number, data: Partial<Employee>) =>
  api.put<Employee>(`/employees/${id}`, data);

export const deleteEmployee = (id: number) =>
  api.delete(`/employees/${id}`);

export const getSalaryStats = (country?: string) =>
  api.get<SalaryStats>('/insights/salary-stats', { params: { country } });

export const getSalaryByTitle = (country?: string) =>
  api.get<SalaryByTitle[]>('/insights/salary-by-title', { params: { country } });