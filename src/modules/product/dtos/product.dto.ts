import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '../../../database/generated/prisma/client';

export class ProductDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty()
  brandId!: string;

  @ApiProperty({ nullable: true })
  vendorId!: string | null;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ nullable: true })
  shortDescription!: string | null;

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty()
  basePrice!: number;

  @ApiProperty()
  specs!: object;

  @ApiProperty()
  warrantyMonths!: number;

  @ApiProperty({ enum: ProductStatus })
  status!: ProductStatus;

  @ApiProperty()
  avgRating!: number;

  @ApiProperty()
  reviewCount!: number;

  @ApiProperty()
  viewCount!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ nullable: true })
  deletedAt!: Date | null;
}
