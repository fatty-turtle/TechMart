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
import { TokensDto } from './dtos/tokens.dto';

export interface RefreshTokenPayload {
  id: number;
  email: string;
  role: string;
}

// export interface OAuthUserDto {
//   email: string;
//   name: string;
//   picture: string;
//   provider: string;
//   accessToken: string;
// }

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async login(dto: LoginDto): Promise<TokensDto> {
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

  async refresh(refreshToken: string): Promise<TokensDto> {
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

  // async validateOAuthUser(oauthUserDto: OAuthUserDto): Promise<TokensDto> {
  //   const { email, name, picture, provider, accessToken } = oauthUserDto;
  //   let user = await this.userRepository.findByEmail(email);
  //   if (!user) {
  //     // Create new user
  //     const username = email.split('@')[0]; // simple username generation
  //     const password = Math.random().toString(36).slice(-8); // random password
  //     const passwordHash = await bcrypt.hash(password, 10);
  //     user = await this.userRepository.create({
  //       email,
  //       username,
  //       passwordHash,
  //       fullName: name,
  //       avatarUrl: picture,
  //       isEmailVerified: true, // OAuth users are considered verified
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //       oauthProvider: provider as any, // cast to enum
  //       oauthId: accessToken.substring(0, 50), // store a subset of token as oauthId for simplicity
  //     });
  //   } else {
  //     // Update existing user with OAuth info if not set
  //     const needsUpdate = !user.oauthProvider || !user.oauthId;
  //     if (needsUpdate) {
  //       await this.userRepository.update(
  //         { id: user.id },
  //         {
  //           oauthProvider: provider as any,
  //           oauthId: accessToken.substring(0, 50),
  //           avatarUrl: picture,
  //           fullName: name,
  //           isEmailVerified: true,
  //         },
  //       );
  //       // Reload user after update
  //       user = await this.userRepository.findById(user.id);
  //       if (!user) {
  //         throw new Error('User not found');
  //       }
  //     }
  //   }

  //   const payload = { sub: user.id, email: user.email, role: user.role };
  //   const refreshToken = this.jwtService.sign(payload, {
  //     secret: this.configService.get('JWT_REFRESH_SECRET'),
  //     expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
  //   });

  //   // Save refresh token
  //   await this.refreshTokenRepository.create({
  //     token: refreshToken,
  //     userId: user.id,
  //   });

  //   return {
  //     access_token: this.jwtService.sign(payload),
  //     refresh_token: refreshToken,
  //   };
  // }
}
