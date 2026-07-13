import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { WishlistItem } from '@/database/generated/prisma/client';
@Injectable()
export class WishlistRepository extends BaseRepository<WishlistItem> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.wishlistItem);
  }
}
