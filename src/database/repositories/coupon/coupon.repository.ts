import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { Coupon } from '@/database/generated/prisma/client';
@Injectable()
export class CouponRepository extends BaseRepository<Coupon> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.coupon);
  }
}
