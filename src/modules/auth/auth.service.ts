import { Injectable } from '@nestjs/common';
import {
  UserRepository,
  RefreshTokenRepository,
} from '../../database/repositories';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, CreateUserDto } from './dtos';
import { ConfigService } from '@nestjs/config';
import { User } from '@/database/generated/prisma/client';

export interface RefreshTokenPayload {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async login(
    dto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.isEmailVerified === false) {
      throw new Error('Email not verified');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    // await this.refreshTokenRepository.create({
    //   token: refreshToken,
    //   userId: user.id,
    //   tokenHash: refreshToken,
    //   expiresAt: ,
    // });

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const decoded = this.jwtService.verify<RefreshTokenPayload>(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    const storedToken =
      await this.refreshTokenRepository.findByToken(refreshToken);
    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    const payload = {
      sub: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    const newRefreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    await this.refreshTokenRepository.deleteByToken(refreshToken);
    await this.refreshTokenRepository.create({
      token: newRefreshToken,
      userId: decoded.id,
    });

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: newRefreshToken,
    };
  }

  async register(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.create({
      email: dto.email,
      username: dto.username,
      passwordHash,
    });
    return user;
  }
}
