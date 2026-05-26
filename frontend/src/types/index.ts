export interface Employee {
  id: number;
  fullName: string;
  jobTitle: string;
  department: string;
  country: string;
  salary: number;
  email: string;
  status: string;
  hiredAt: string;
}

export interface PaginatedResponse {
  data: Employee[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SalaryStats {
  country: string;
  min: number;
  max: number;
  avg: number;
  count: number;
}

export interface SalaryByTitle {
  jobTitle: string;
  avgSalary: number;
  count: number;
  vsOrgAvg: number;
}