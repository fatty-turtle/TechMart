import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { Review } from '@/database/generated/prisma/client';
@Injectable()
export class ReviewRepository extends BaseRepository<Review> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.review);
  }
}
