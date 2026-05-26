import { beforeAll, afterAll } from 'vitest';
import prisma from '../prismaClient';

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});