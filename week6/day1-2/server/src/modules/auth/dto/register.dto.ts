import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO for user registration
 * This validates incoming request body
 */
export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user'
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Unique email address of the user'
  })
  @IsEmail() // must be a valid email
  email: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'Minimum 6 character long password',
    minLength: 6
  })
  @IsString()
  @MinLength(6) // security requirement
  password: string;
}
