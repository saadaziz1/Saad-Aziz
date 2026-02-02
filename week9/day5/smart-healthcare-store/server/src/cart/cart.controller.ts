import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    private getSessionId(headers: Record<string, string>, user?: any): string {
        // Prefer user ID if authenticated, else match x-session-id or guest
        if (user && user._id) {
            return user._id.toString();
        }
        return headers['x-session-id'] || 'guest-session';
    }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    async getCart(@Headers() headers: Record<string, string>, @Req() req) {
        const sessionId = this.getSessionId(headers, req.user);
        return this.cartService.getCart(sessionId);
    }

    @Post('add')
    @UseGuards(OptionalJwtAuthGuard)
    async addToCart(
        @Headers() headers: Record<string, string>,
        @Req() req,
        @Body() body: { productId: string; quantity?: number },
    ) {
        const sessionId = this.getSessionId(headers, req.user);
        return this.cartService.addToCart(sessionId, body.productId, body.quantity || 1);
    }

    @Patch('update')
    @UseGuards(OptionalJwtAuthGuard)
    async updateQuantity(
        @Headers() headers: Record<string, string>,
        @Req() req,
        @Body() body: { productId: string; quantity: number },
    ) {
        const sessionId = this.getSessionId(headers, req.user);
        return this.cartService.updateQuantity(sessionId, body.productId, body.quantity);
    }

    @Delete('remove/:productId')
    @UseGuards(OptionalJwtAuthGuard)
    async removeFromCart(
        @Headers() headers: Record<string, string>,
        @Req() req,
        @Param('productId') productId: string,
    ) {
        const sessionId = this.getSessionId(headers, req.user);
        return this.cartService.removeFromCart(sessionId, productId);
    }

    @Delete('clear')
    @UseGuards(OptionalJwtAuthGuard)
    async clearCart(@Headers() headers: Record<string, string>, @Req() req) {
        const sessionId = this.getSessionId(headers, req.user);
        return this.cartService.clearCart(sessionId);
    }
}
