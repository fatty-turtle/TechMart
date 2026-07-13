import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { Product } from '@/database/generated/prisma/client';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.product);
  }
}
