import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { CartItem } from '@/database/generated/prisma/client';
@Injectable()
export class CartItemRepository extends BaseRepository<CartItem> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.cartItem);
  }
}
