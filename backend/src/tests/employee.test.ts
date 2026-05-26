import { describe, it, expect, beforeEach } from 'vitest';
import supertest from 'supertest';
import app from '../index';
import prisma from '../prismaClient';

const request = supertest(app);

beforeEach(async () => {
  await prisma.employee.deleteMany();
});

describe('GET /api/employees', () => {
  it('should return paginated list of employees', async () => {
    await prisma.employee.create({
      data: {
        fullName: 'Test User',
        jobTitle: 'Engineer',
        department: 'Engineering',
        country: 'India',
        salary: 80000,
        email: 'test@corp.com',
        status: 'active',
      },
    });

    const res = await request.get('/api/employees');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.total).toBe(1);
  });

  it('should filter employees by country', async () => {
    await prisma.employee.createMany({
      data: [
        { fullName: 'India User', jobTitle: 'Engineer', department: 'Eng', country: 'India', salary: 70000, email: 'india@corp.com', status: 'active' },
        { fullName: 'USA User', jobTitle: 'Manager', department: 'Eng', country: 'USA', salary: 90000, email: 'usa@corp.com', status: 'active' },
      ],
    });

    const res = await request.get('/api/employees?country=India');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].country).toBe('India');
  });
});

describe('POST /api/employees', () => {
  it('should create a new employee', async () => {
    const newEmployee = {
      fullName: 'Priya Sharma',
      jobTitle: 'Designer',
      department: 'Design',
      country: 'India',
      salary: 75000,
      email: 'priya@corp.com',
      status: 'active',
    };

    const res = await request.post('/api/employees').send(newEmployee);
    expect(res.status).toBe(201);
    expect(res.body.fullName).toBe('Priya Sharma');
    expect(res.body.id).toBeDefined();
  });

  it('should reject duplicate email', async () => {
    const data = {
      fullName: 'User One', jobTitle: 'Engineer', department: 'Eng',
      country: 'India', salary: 70000, email: 'same@corp.com', status: 'active',
    };
    await prisma.employee.create({ data });

    const res = await request.post('/api/employees').send(data);
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/employees/:id', () => {
  it('should update an employee salary', async () => {
    const emp = await prisma.employee.create({
      data: {
        fullName: 'Update Me', jobTitle: 'Engineer', department: 'Eng',
        country: 'India', salary: 70000, email: 'update@corp.com', status: 'active',
      },
    });

    const res = await request.put(`/api/employees/${emp.id}`).send({ salary: 90000 });
    expect(res.status).toBe(200);
    expect(res.body.salary).toBe(90000);
  });
});

describe('DELETE /api/employees/:id', () => {
  it('should delete an employee', async () => {
    const emp = await prisma.employee.create({
      data: {
        fullName: 'Delete Me', jobTitle: 'Analyst', department: 'Analytics',
        country: 'UK', salary: 50000, email: 'delete@corp.com', status: 'active',
      },
    });

    const res = await request.delete(`/api/employees/${emp.id}`);
    expect(res.status).toBe(200);

    const check = await prisma.employee.findUnique({ where: { id: emp.id } });
    expect(check).toBeNull();
  });
});