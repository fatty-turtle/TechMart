import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  UserRepository,
  RefreshTokenRepository,
} from '../../database/repositories';
import { JwtService } from '@nestjs/jwt';
import { createTestingModule, getController } from '@/test/test-utils';

describe('AuthController', () => {
  let controller: AuthController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule(
      [AuthController],
      [AuthService, UserRepository, RefreshTokenRepository, JwtService],
    );

    controller = getController(module, AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
