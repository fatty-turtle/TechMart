import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { OrderStatusHistory } from '@/database/generated/prisma/client';
@Injectable()
export class OrderStatusRepository extends BaseRepository<OrderStatusHistory> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.orderStatusHistory);
  }
}
