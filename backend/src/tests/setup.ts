import { beforeAll, afterAll } from 'vitest';
import prisma from '../prismaClient';

beforeAll(async () => {
  await prisma.$connect();
}, 30000);

afterAll(async () => {
  await prisma.$disconnect();
}, 30000);