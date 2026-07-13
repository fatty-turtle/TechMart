import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository } from '../base.repository';
import { RefreshToken } from '@/database/generated/prisma/client';
@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.refreshToken);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return await this.repository.findUnique({ where: { token } });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.repository.delete({ where: { token } });
  }
}
