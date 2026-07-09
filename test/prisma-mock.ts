import { PrismaClient } from '#database/generated/prisma/client.js';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type MockPrismaService = DeepMockProxy<PrismaClient>;

export const createPrismaMock = (): MockPrismaService =>
  mockDeep<PrismaClient>();
