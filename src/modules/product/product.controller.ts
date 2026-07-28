import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductDto } from './dtos/product.dto';
import { ApiTags, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Product } from '@/database/generated/prisma/client';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retrieve all products',
    type: [ProductDto],
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'brandId',
    required: false,
    description: 'Filter by brand ID',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for product name/description',
  })
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('search') search?: string,
  ): Promise<Product[]> {
    if (categoryId) {
      return this.productService.findByCategory(categoryId);
    }

    if (brandId) {
      return this.productService.findByBrand(brandId);
    }

    if (search) {
      return this.productService.search(search);
    }

    return this.productService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Retrieve a product by ID',
    type: ProductDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    type: ProductDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productService.remove(id);
  }
}
