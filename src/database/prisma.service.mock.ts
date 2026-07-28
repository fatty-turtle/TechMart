import { PrismaClient } from '@/database/generated/prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type MockPrismaService = DeepMockProxy<PrismaClient>;

export const createMockPrismaService = (): MockPrismaService =>
  mockDeep<PrismaClient>();
