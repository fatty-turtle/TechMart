import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { User } from '@/database/generated/prisma/client';
@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.repository.findUnique({ where: { username } });
  }
}
