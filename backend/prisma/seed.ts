import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const countries = ['India', 'USA', 'UK', 'Germany', 'Canada'];
const jobTitles = ['Engineer', 'Senior Engineer', 'Manager', 'Director', 'Designer', 'Analyst', 'Product Manager'];
const departments = ['Engineering', 'Product', 'Design', 'Analytics', 'Leadership', 'Marketing', 'HR'];
const statuses = ['active', 'active', 'active', 'on_leave'];

function loadLines(filename: string): string[] {
  const filePath = path.join(__dirname, filename);
  return fs.readFileSync(filePath, 'utf-8')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSalary(jobTitle: string): number {
  const ranges: Record<string, [number, number]> = {
    'Director': [120000, 180000],
    'Manager': [80000, 120000],
    'Product Manager': [85000, 130000],
    'Senior Engineer': [90000, 140000],
    'Engineer': [60000, 100000],
    'Designer': [55000, 95000],
    'Analyst': [45000, 80000],
  };
  const [min, max] = ranges[jobTitle] || [40000, 100000];
  return Math.floor(Math.random() * (max - min) + min);
}

function randomDate(): Date {
  const yearsBack = Math.random() * 5;
  return new Date(Date.now() - yearsBack * 365 * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log('Clearing existing data...');
  await prisma.employee.deleteMany();

  const firstNames = loadLines('first_names.txt');
  const lastNames = loadLines('last_names.txt');

  console.log('Generating 10,000 employees...');

  const TOTAL = 10000;
  const BATCH_SIZE = 500;

  const employees = Array.from({ length: TOTAL }, (_, i) => {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    const jobTitle = pick(jobTitles);
    return {
      fullName: `${firstName} ${lastName}`,
      jobTitle,
      department: pick(departments),
      country: pick(countries),
      salary: randomSalary(jobTitle),
      email: `emp${i + 1}.${firstName.toLowerCase()}.${lastName.toLowerCase()}@corp.com`,
      status: pick(statuses),
      hiredAt: randomDate(),
    };
  });

  let inserted = 0;
  for (let i = 0; i < employees.length; i += BATCH_SIZE) {
    const batch = employees.slice(i, i + BATCH_SIZE);
    await prisma.employee.createMany({ data: batch });
    inserted += batch.length;
    console.log(`Inserted ${inserted}/${TOTAL} employees...`);
  }

  console.log('Seed complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());