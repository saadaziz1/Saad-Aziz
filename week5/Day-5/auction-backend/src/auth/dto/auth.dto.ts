import { IsString, IsEmail, MinLength, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'seller1@example.com',
    description: 'Username or email address of the user',
    required: true,
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  identifier: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (minimum 6 characters)',
    minLength: 6,
    required: true,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username (min 3 characters, letters, numbers, and underscores only)',
    minLength: 3,
    required: true,
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Valid email address',
    format: 'email',
    required: true,
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    required: true,
  })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  fullName: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Mobile number without country code (7-15 digits)',
    pattern: '^\\d{7,15}$',
    required: true,
  })
  @IsNotEmpty({ message: 'Mobile number is required' })
  @IsString({ message: 'Mobile number must be a string' })
  mobileNumber: string;

  @ApiProperty({
    example: '+971',
    description: 'Country calling code (e.g., +1, +971, +44)',
    required: true,
  })
  @IsNotEmpty({ message: 'Country code is required' })
  @IsString({ message: 'Country code must be a string' })
  countryCode: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Strong password (minimum 6 characters)',
    minLength: 6,
    required: true,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
  access_token: string;

  @ApiProperty({
    example: {
      _id: '507f1f77bcf86cd799439011',
      username: 'john_doe',
      email: 'john@example.com',
      fullName: 'John Doe'
    },
    description: 'User information'
  })
  user: object;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: ['Email or username is required', 'Password must be at least 6 characters long'],
    description: 'Error message(s)',
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } }
    ]
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request', description: 'Error type' })
  error: string;
}
