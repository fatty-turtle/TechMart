import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { ProductVariant } from '@/database/generated/prisma/client';
@Injectable()
export class ProductVariantRepository extends BaseRepository<ProductVariant> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.productVariant);
  }
}
