import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  UserRepository,
  RefreshTokenRepository,
} from '@/database/repositories';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import { PassportModule } from '@nestjs/passport';
// import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<number>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    RefreshTokenRepository,
    // GoogleStrategy,
  ],
  exports: [
    AuthService,
    JwtModule,
    // PassportModule
  ],
})
export class AuthModule {}
