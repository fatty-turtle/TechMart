import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { Notification } from '@/database/generated/prisma/client';
@Injectable()
export class NotificationRepository extends BaseRepository<Notification> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.notification);
  }
}
