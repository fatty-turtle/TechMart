import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { ProductImage } from '@/database/generated/prisma/client';
@Injectable()
export class ProductImageRepository extends BaseRepository<ProductImage> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.productImage);
  }
}
