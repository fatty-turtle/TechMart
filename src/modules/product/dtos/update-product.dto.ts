import {
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

export class UpdateProductDto {
  @ApiProperty({
    example: 'Updated Smartphone XYZ',
    description: 'Product name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'updated-smartphone-xyz',
    description: 'URL-friendly product slug',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

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
    example: 899.99,
    description: 'Base price of the product',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  @Min(0)
  basePrice?: number;

  @ApiProperty({
    example: '{"screen": "6.5 inch", "camera": "12MP"}',
    description: 'Product specifications in JSON format',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  specs?: object;

  @ApiProperty({
    example: 24,
    description: 'Warranty period in months',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  warrantyMonths?: number;

  @ApiProperty({
    example: 'published',
    description: 'Product status',
    enum: ProductStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiProperty({
    example: 'category-uuid',
    description: 'Category ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    example: 'brand-uuid',
    description: 'Brand ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  brandId?: string;

  @ApiProperty({
    example: 'vendor-uuid',
    description: 'Vendor ID (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  vendorId?: string;
}
