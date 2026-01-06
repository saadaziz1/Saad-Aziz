import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

/**
 * User can only update safe fields
 */
export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'John Doe', description: 'Updated name of the user' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'john.new@example.com', description: 'Updated email of the user' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: '+1234567890', description: 'User phone number' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: '123 Street, City, Country', description: 'User shipping address' })
    @IsOptional()
    @IsString()
    address?: string;
}
