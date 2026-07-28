import { Test, TestingModule } from '@nestjs/testing';
// import { ConfigType, registerAs } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';

import { PrismaClient } from '@/database/generated/prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { Type, Provider } from '@nestjs/common';

type MockPrismaService = DeepMockProxy<PrismaClient>;

const createMockPrismaService = (): MockPrismaService =>
  mockDeep<PrismaClient>();

/**
 * Creates a mock ConfigService that can be used in tests
 * @param config Optional configuration to override defaults
 */
export const createMockConfigService = (
  config: Record<string, unknown> = {},
): ConfigService => {
  const mockConfigService = {
    get: <T = unknown>(key: string, defaultValue?: T): T | null => {
      const value = config[key];
      return (value as T) ?? defaultValue ?? null;
    },
    getOrThrow: <T = unknown>(key: string): T => {
      const value = config[key];
      if (value === undefined) {
        throw new Error(`Configuration key '${key}' is not defined`);
      }
      return value as T;
    },
    getAsBoolean: (key: string, defaultValue = false): boolean => {
      const value = config[key];
      if (value === undefined) return defaultValue;
      return typeof value === 'string' ? value === 'true' : Boolean(value);
    },

    getAsNumber: (key: string, defaultValue = 0): number => {
      const value = config[key];
      if (value === undefined) return defaultValue;
      return typeof value === 'string' ? parseFloat(value) : Number(value);
    },
    getAsString: (key: string, defaultValue = ''): string => {
      const value = config[key];
      if (value === undefined || value === null) return defaultValue;

      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        return String(value);
      }

      // Fallback for objects/arrays/etc — avoid silent "[object Object]"
      return defaultValue;
    },
    getAsNumberArray: (key: string, defaultValue: number[] = []): number[] => {
      const value = config[key];
      if (value === undefined) return defaultValue;
      return Array.isArray(value)
        ? value.map((v) => Number(v))
        : [Number(value)];
    },
    // Add the missing properties from ConfigService to satisfy TypeScript
    // These are internal properties that we don't need to mock for most tests
    get internalConfig(): Record<string, unknown> {
      return config;
    },
    get isCacheEnabled() {
      return false;
    },
    get skipProcessEnv() {
      return true;
    },
    get cache() {
      return new Map<string, unknown>();
    },
    get envFilePath() {
      return undefined;
    },
  };

  // Use type assertion to satisfy TypeScript - in testing context this is safe
  // as we control what properties are actually accessed
  return mockConfigService as unknown as ConfigService;
};

/**
 * Helper function to create a TestingModule for unit tests with mocked PrismaService and ConfigService
 * @param controllers Controllers to include in the module
 * @param providers Providers to include in the module (services, repositories, etc.)
 * @param config Optional configuration for the mock ConfigService
 */
export const createTestingModule = async (
  controllers: Type<any>[] = [],
  providers: Provider[] = [],
  config: Record<string, unknown> = {},
): Promise<TestingModule> => {
  const mockPrismaService = createMockPrismaService();
  const mockConfigService = createMockConfigService(config);

  return await Test.createTestingModule({
    controllers: [...controllers],
    providers: [
      ...providers,
      { provide: PrismaService, useValue: mockPrismaService },
      { provide: ConfigService, useValue: mockConfigService },
    ],
  }).compile();
};

/**
 * Helper function to get a controller instance from a TestingModule
 */
export const getController = <T>(
  module: TestingModule,
  controller: new (...args: any[]) => T,
): T => {
  return module.get<T>(controller);
};

/**
 * Helper function to get a service instance from a TestingModule
 */
export const getService = <T>(
  module: TestingModule,
  service: new (...args: any[]) => T,
): T => {
  return module.get<T>(service);
};

/**
 * Helper function to get a repository instance from a TestingModule
 */
export const getRepository = <T>(
  module: TestingModule,
  repository: new (...args: any[]) => T,
): T => {
  return module.get<T>(repository);
};

/**
 * Convenience function that creates a testing module and returns both the module and the service instance
 * @param controllers Controllers to include in the module
 * @param providers Providers (services, repositories, etc.) to include in the module
 * @param serviceClass The service/class to retrieve from the module
 * @param config Optional configuration for the mock ConfigService
 * @returns Tuple of [TestingModule, serviceInstance]
 */
export const createTestingModuleWithService = async <T>(
  controllers: Type<any>[] = [],
  providers: Provider[] = [],
  serviceClass: new (...args: any[]) => T,
  config: Record<string, unknown> = {},
): Promise<[TestingModule, T]> => {
  const module = await createTestingModule(controllers, providers, config);
  const service = module.get<T>(serviceClass);
  return [module, service];
};

// Re-export the prisma mock for convenience
export { createMockPrismaService };
export type { MockPrismaService };
