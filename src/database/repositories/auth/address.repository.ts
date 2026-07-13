import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { Address } from '@/database/generated/prisma/client';
@Injectable()
export class AdressRepository extends BaseRepository<Address> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.address);
  }
}
