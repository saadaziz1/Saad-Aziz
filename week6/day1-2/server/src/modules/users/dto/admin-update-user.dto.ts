import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

/**
 * Consolidated Admin-only user updates
 */
export class AdminUpdateUserDto {

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ enum: Role, example: Role.ADMIN })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
