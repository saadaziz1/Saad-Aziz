import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('loyalty')
@UseGuards(JwtAuthGuard)
export class LoyaltyController {
    constructor(private readonly loyaltyService: LoyaltyService) { }

    @Get('balance')
    async getBalance(@Request() req) {
        const balance = await this.loyaltyService.getBalance(req.user.userId);
        return { balance };
    }

    @Get('history')
    async getHistory(@Request() req) {
        return this.loyaltyService.getHistory(req.user.userId);
    }
}
