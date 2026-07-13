import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { AdminActionLog } from '@/database/generated/prisma/client';
@Injectable()
export class AdminActionLogRepository extends BaseRepository<AdminActionLog> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.adminActionLog);
  }
}
