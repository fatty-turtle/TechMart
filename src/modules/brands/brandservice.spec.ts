import { Test, TestingModule } from '@nestjs/testing';
import { BrandService } from './brand.service';
import { BrandRepository } from '@/database/repositories';
import { createTestingModule, getService } from '@/test/test-utils';

describe('BrandsService', () => {
  let service: BrandService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule(
      [], //
      [BrandService, BrandRepository],
    );
    service = getService(module, BrandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
