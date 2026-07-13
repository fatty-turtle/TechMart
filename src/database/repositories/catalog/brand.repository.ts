import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { Brand } from '@/database/generated/prisma/client';
@Injectable()
export class BrandRepository extends BaseRepository<Brand> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.brand);
  }
}
