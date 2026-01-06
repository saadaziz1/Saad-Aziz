import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoyaltyService } from './loyalty.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Loyalty')
@ApiBearerAuth()
@Controller('loyalty')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class LoyaltyController {
    constructor(private readonly loyaltyService: LoyaltyService) { }

    @Get('balance')
    @ApiOperation({ summary: 'Get current user loyalty balance' })
    @ApiResponse({ status: 200, description: 'Return loyalty balance.' })
    async getBalance(@Request() req) {
        const balance = await this.loyaltyService.getBalance(req.user.userId);
        return { balance };
    }

    @Get('history')
    @ApiOperation({ summary: 'Get current user loyalty history' })
    @ApiResponse({ status: 200, description: 'Return list of loyalty ledger entries.' })
    async getHistory(@Request() req) {
        return this.loyaltyService.getHistory(req.user.userId);
    }
}
