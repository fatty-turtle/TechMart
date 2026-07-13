import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { Payment } from '@/database/generated/prisma/client';
@Injectable()
export class PaymentRepository extends BaseRepository<Payment> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.payment);
  }
}
