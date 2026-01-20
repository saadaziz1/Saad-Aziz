import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email: string;

    @ApiProperty({ example: 'strongpassword', description: 'User password', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    password: string;

    @ApiProperty({ example: 'John Doe', description: 'User name' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: true, description: 'Is user active', required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
