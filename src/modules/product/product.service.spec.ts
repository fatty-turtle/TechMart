import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from '../../database/repositories';
import { createTestingModule, getService } from '@/test/test-utils';

describe('ProductsService', () => {
  let service: ProductService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule(
      [], // controllers (none for service test)
      [ProductService, ProductRepository], // providers (PrismaService and ConfigService are mocked automatically)
    );

    service = getService(module, ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
