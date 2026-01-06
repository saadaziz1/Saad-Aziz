import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { ChangeRoleDto } from './dto/change-role.dto';

@ApiTags('Admin Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/users')
export class AdminUsersController {

    constructor(private readonly usersService: UsersService) { }

    /** Admin: get all users */
    @Roles(Role.SUPER_ADMIN)
    @Get()
    @ApiOperation({ summary: 'Get all users (Super Admin only)' })
    @ApiResponse({ status: 200, description: 'Return all users.' })
    getAllUsers() {
        return this.usersService.findAll();
    }

    @Roles(Role.SUPER_ADMIN)
    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID (Super Admin only)' })
    @ApiResponse({ status: 200, description: 'Return user details.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    getUserById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    /** Super Admin: Toggle user block/unblock status */
    @Roles(Role.SUPER_ADMIN)
    @Patch(':id/active-status')
    @ApiOperation({ summary: 'Toggle user active/inactive status (Super Admin only)' })
    @ApiResponse({ status: 200, description: 'User status toggled successfully.' })
    toggleUserStatus(@Param('id') id: string) {
        return this.usersService.toggleStatus(id);
    }

    /** Super Admin: Change user role */
    @Roles(Role.SUPER_ADMIN)
    @Patch(':id/role')
    @ApiOperation({ summary: 'Change user role (Super Admin only)' })
    @ApiResponse({ status: 200, description: 'User role updated successfully.' })
    changeUserRole(
        @Param('id') id: string,
        @Body() dto: ChangeRoleDto,
    ) {
        return this.usersService.changeRole(id, dto.role);
    }
}
