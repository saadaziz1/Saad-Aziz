import { IsString, IsEmail, MinLength, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username or email of the user',
  })
  @IsNotEmpty({ message: 'Email or username is required' })
  @IsString({ message: 'Email or username must be a string' })
  identifier: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the user (min 6 characters)',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'john_doe', description: 'Unique username' })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  fullName: string;

  @ApiProperty({ example: '+1234567890', description: 'Mobile number' })
  @IsNotEmpty({ message: 'Mobile number is required' })
  @IsString({ message: 'Mobile number must be a string' })
  mobileNumber: string;

  @ApiProperty({ example: '+971', description: 'Country code' })
  @IsNotEmpty({ message: 'Country code is required' })
  @IsString({ message: 'Country code must be a string' })
  countryCode: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password (min 6 characters)',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
