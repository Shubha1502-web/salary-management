import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getSalaryStats = async (req: Request, res: Response) => {
  try {
    const country = req.query.country as string;
    const where = country ? { country } : {};

    const stats = await prisma.employee.aggregate({
      where,
      _min: { salary: true },
      _max: { salary: true },
      _avg: { salary: true },
      _count: { id: true },
    });

    res.json({
      country: country || 'all',
      min: stats._min.salary,
      max: stats._max.salary,
      avg: Math.round(stats._avg.salary || 0),
      count: stats._count.id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salary stats' });
  }
};

export const getSalaryByTitle = async (req: Request, res: Response) => {
  try {
    const country = req.query.country as string;
    const where = country ? { country } : {};

    const grouped = await prisma.employee.groupBy({
      by: ['jobTitle'],
      where,
      _avg: { salary: true },
      _count: { id: true },
    });

    const orgAvg = await prisma.employee.aggregate({
      _avg: { salary: true },
    });

    const orgAvgSalary = orgAvg._avg.salary || 0;

    const result = grouped.map((g) => ({
      jobTitle: g.jobTitle,
      avgSalary: Math.round(g._avg.salary || 0),
      count: g._count.id,
      vsOrgAvg: Math.round(
        (((g._avg.salary || 0) - orgAvgSalary) / orgAvgSalary) * 100
      ),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salary by title' });
  }
};