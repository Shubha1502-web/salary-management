import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const country = req.query.country as string;
    const jobTitle = req.query.jobTitle as string;
    const search = req.query.search as string;

    const where: any = {};
    if (country) where.country = country;
    if (jobTitle) where.jobTitle = jobTitle;
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.employee.count({ where }),
    ]);

    res.json({ data, total, page, pageSize });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.create({ data: req.body });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create employee' });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const employee = await prisma.employee.update({
      where: { id },
      data: req.body,
    });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update employee' });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.employee.delete({ where: { id } });
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete employee' });
  }
};