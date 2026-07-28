import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '@/common/decorators/match.decorator';

export class CreateUserDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'User email address',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Username (3-30 characters)',
    minLength: 3,
    maxLength: 30,
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(30, { message: 'Username cannot exceed 30 characters' })
  username!: string;

  @ApiProperty({
    example: 'Admin123!',
    description: 'User password (6-100 characters)',
    minLength: 6,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(100, { message: 'Password cannot exceed 100 characters' })
  password!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Must match the password field (6-100 characters)',
    minLength: 6,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @IsString()
  @MinLength(6, {
    message: 'Password confirmation must be at least 6 characters long',
  })
  @MaxLength(100, {
    message: 'Password confirmation cannot exceed 100 characters',
  })
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword!: string;
}
