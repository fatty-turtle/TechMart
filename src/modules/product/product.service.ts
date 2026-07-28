import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../database/repositories';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from '../../database/generated/prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Ensure specs is an object, default to empty object if not provided
    const createData = {
      ...createProductDto,
      specs: createProductDto.specs ?? {},
    };
    return this.productRepo.create(createData);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.findMany({});
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productRepo.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Ensure specs is an object if provided
    const updateData = {
      ...updateProductDto,
      specs:
        updateProductDto.specs !== undefined
          ? updateProductDto.specs
          : undefined,
    };

    const updatedProduct = await this.productRepo.update(
      { where: { id } },
      updateData,
    );

    if (!updatedProduct) {
      // This should not happen if the product exists, but handle it just in case
      throw new NotFoundException(
        `Product with ID ${id} not found during update`,
      );
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const existingProduct = await this.productRepo.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.productRepo.delete({ where: { id } });
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.productRepo.findMany({
      where: { categoryId },
    });
  }

  async findByBrand(brandId: string): Promise<Product[]> {
    return this.productRepo.findMany({
      where: { brandId },
    });
  }

  async search(query: string): Promise<Product[]> {
    return this.productRepo.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }
}
