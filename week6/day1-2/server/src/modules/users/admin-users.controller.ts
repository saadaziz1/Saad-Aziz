import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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
    getAllUsers() {
        return this.usersService.findAll();
    }

    @Roles(Role.SUPER_ADMIN)
    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    /** Super Admin: Toggle user block/unblock status */
    @Roles(Role.SUPER_ADMIN)
    @Patch(':id/active-status')
    toggleUserStatus(@Param('id') id: string) {
        return this.usersService.toggleStatus(id);
    }

    /** Super Admin: Change user role */
    @Roles(Role.SUPER_ADMIN)
    @Patch(':id/role')
    changeUserRole(
        @Param('id') id: string,
        @Body() dto: ChangeRoleDto,
    ) {
        return this.usersService.changeRole(id, dto.role);
    }
}
