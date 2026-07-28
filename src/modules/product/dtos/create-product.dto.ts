import {
  IsNotEmpty,
  IsString,
  IsDecimal,
  Min,
  IsInt,
  IsOptional,
  IsEnum,
  IsJSON,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@/database/generated/prisma/client';

export class CreateProductDto {
  @ApiProperty({
    example: 'Smartphone XYZ',
    description: 'Product name',
  })
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'smartphone-xyz',
    description: 'URL-friendly product slug',
  })
  @IsNotEmpty({ message: 'Product slug is required' })
  @IsString()
  slug!: string;

  @ApiProperty({
    example: 'Latest smartphone with advanced features',
    description: 'Short product description',
    required: false,
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({
    example:
      'This smartphone features advanced camera technology and long battery life.',
    description: 'Detailed product description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 999.99,
    description: 'Base price of the product',
  })
  @IsNotEmpty({ message: 'Base price is required' })
  @IsDecimal()
  @Min(0)
  basePrice!: number;

  @ApiProperty({
    example: '{}',
    description: 'Product specifications in JSON format',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  specs?: object = {};

  @ApiProperty({
    example: 12,
    description: 'Warranty period in months',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  warrantyMonths?: number = 12;

  @ApiProperty({
    example: 'published',
    description: 'Product status',
    enum: ProductStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus = ProductStatus.draft;

  @ApiProperty({
    example: 'category-uuid',
    description: 'Category ID',
  })
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsString()
  categoryId!: string;

  @ApiProperty({
    example: 'brand-uuid',
    description: 'Brand ID',
  })
  @IsNotEmpty({ message: 'Brand ID is required' })
  @IsString()
  brandId!: string;

  @ApiProperty({
    example: 'vendor-uuid',
    description: 'Vendor ID (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  vendorId?: string;
}
