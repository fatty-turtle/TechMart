import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { Category } from '@/database/generated/prisma/client';
@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.category);
  }
}
