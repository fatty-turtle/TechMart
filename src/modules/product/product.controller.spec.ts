import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductRepository } from '../../database/repositories';
import { ProductService } from './product.service';
import { createTestingModule, getService } from '@/test/test-utils';

describe('ProductsController', () => {
  let controller: ProductController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule(
      [ProductController], // controllers
      [ProductService, ProductRepository],
    );

    controller = getService(module, ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
