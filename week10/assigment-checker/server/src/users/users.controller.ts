import { Controller, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('moderator')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Patch(':id/toggle-block')
    async toggleBlock(@Param('id') id: string, @Request() req: any) {
        return this.usersService.toggleBlock(id, req.user.userId);
    }

    @Patch(':id/change-role')
    async changeRole(
        @Param('id') id: string,
        @Body('role') role: string,
        @Request() req: any
    ) {
        return this.usersService.changeRole(id, role, req.user.userId);
    }
}
