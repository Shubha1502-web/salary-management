import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../index';
import prisma from '../prismaClient';

const request = supertest(app);

beforeAll(async () => {
  await prisma.employee.deleteMany();
  await prisma.employee.createMany({
    data: [
      { fullName: 'A One', jobTitle: 'Engineer', department: 'Eng', country: 'India', salary: 60000, email: 'ins1@corp.com', status: 'active' },
      { fullName: 'A Two', jobTitle: 'Engineer', department: 'Eng', country: 'India', salary: 80000, email: 'ins2@corp.com', status: 'active' },
      { fullName: 'A Three', jobTitle: 'Manager', department: 'Eng', country: 'India', salary: 100000, email: 'ins3@corp.com', status: 'active' },
      { fullName: 'B One', jobTitle: 'Engineer', department: 'Eng', country: 'USA', salary: 120000, email: 'ins4@corp.com', status: 'active' },
    ],
  });
}, 30000);

afterAll(async () => {
  await prisma.employee.deleteMany();
}, 30000);

describe('GET /api/insights/salary-stats', () => {
  it('should return min, max, avg for all employees', async () => {
    const res = await request.get('/api/insights/salary-stats');
    expect(res.status).toBe(200);
    expect(res.body.min).toBe(60000);
    expect(res.body.max).toBe(120000);
    expect(res.body.avg).toBe(90000);
    expect(res.body.count).toBe(4);
  });

  it('should return stats filtered by country', async () => {
    const res = await request.get('/api/insights/salary-stats?country=India');
    expect(res.status).toBe(200);
    expect(res.body.min).toBe(60000);
    expect(res.body.max).toBe(100000);
    expect(res.body.count).toBe(3);
  });
});

describe('GET /api/insights/salary-by-title', () => {
  it('should return avg salary grouped by job title', async () => {
    const res = await request.get('/api/insights/salary-by-title?country=India');
    expect(res.status).toBe(200);
    const engineer = res.body.find((r: any) => r.jobTitle === 'Engineer');
    expect(engineer).toBeDefined();
    expect(engineer.avgSalary).toBe(70000);
    expect(engineer.count).toBe(2);
  });

  it('should include vsOrgAvg percentage', async () => {
    const res = await request.get('/api/insights/salary-by-title');
    expect(res.status).toBe(200);
    const manager = res.body.find((r: any) => r.jobTitle === 'Manager');
    expect(manager.vsOrgAvg).toBeDefined();
  });
});