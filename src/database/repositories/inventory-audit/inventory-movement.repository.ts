import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { InventoryMovement } from '@/database/generated/prisma/client';
@Injectable()
export class InventoryMovementRepository extends BaseRepository<InventoryMovement> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.inventoryMovement);
  }
}
