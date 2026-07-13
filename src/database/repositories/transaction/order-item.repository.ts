import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { OrderItem } from '@/database/generated/prisma/client';
@Injectable()
export class OrderItemRepository extends BaseRepository<OrderItem> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.orderItem);
  }
}
