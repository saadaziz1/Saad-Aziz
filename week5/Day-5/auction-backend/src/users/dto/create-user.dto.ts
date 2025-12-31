import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '+1', description: 'Country code' })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({ example: '1234567890', description: 'Mobile number' })
  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password hash or plain password during registration',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  passwordHash: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Profile picture URL',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Profile picture must be a valid URL.' })
  profilePicture?: string;
}
