import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import {
  UserRepository,
  RefreshTokenRepository,
} from '../../database/repositories';
import { JwtService } from '@nestjs/jwt';
import { createTestingModule, getService } from '@/test/test-utils';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule(
      [], 
      [AuthService, UserRepository, RefreshTokenRepository, JwtService],
    );

    service = getService(module, AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
