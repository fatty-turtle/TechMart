import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { ReviewImage } from '@/database/generated/prisma/client';
@Injectable()
export class ReviewImageRepository extends BaseRepository<ReviewImage> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.reviewImage);
  }
}
