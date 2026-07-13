import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { Order } from '@/database/generated/prisma/client';
@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.order);
  }
}
