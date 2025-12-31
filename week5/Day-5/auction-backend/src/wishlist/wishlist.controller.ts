import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Post(':carId')
  @ApiOperation({ summary: 'Add a car to my wishlist' })
  @ApiResponse({ status: 201, description: 'Added to wishlist' })
  addToWishlist(@Param('carId') carId: string, @Request() req: any) {
    return this.wishlistService.addToWishlist(req.user.userId, carId);
  }

  @Delete(':carId')
  @ApiOperation({ summary: 'Remove a car from my wishlist' })
  @ApiResponse({ status: 200, description: 'Removed from wishlist' })
  removeFromWishlist(@Param('carId') carId: string, @Request() req: any) {
    return this.wishlistService.removeFromWishlist(req.user.userId, carId);
  }

  @Get()
  @ApiOperation({ summary: 'Get my wishlist' })
  @ApiResponse({ status: 200, description: 'Return user wishlist' })
  getUserWishlist(@Request() req: any) {
    return this.wishlistService.getUserWishlist(req.user.userId);
  }
}
