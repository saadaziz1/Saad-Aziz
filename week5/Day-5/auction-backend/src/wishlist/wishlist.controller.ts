import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { WishlistResponseDto } from './dto/create-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ErrorResponseDto } from '../auth/dto/auth.dto';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Post(':carId')
  @ApiOperation({ summary: 'Add a car to my wishlist' })
  @ApiResponse({
    status: 201,
    description: 'Added to wishlist',
    type: WishlistResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid car ID format',
        error: 'Bad Request'
      }
    }
  })
  addToWishlist(@Param('carId') carId: string, @Request() req: any) {
    return this.wishlistService.addToWishlist(req.user.userId, carId);
  }

  @Delete(':carId')
  @ApiOperation({ summary: 'Remove a car from my wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Removed from wishlist',
    type: WishlistResponseDto
  })
  removeFromWishlist(@Param('carId') carId: string, @Request() req: any) {
    return this.wishlistService.removeFromWishlist(req.user.userId, carId);
  }

  @Get()
  @ApiOperation({ summary: 'Get my wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Return user wishlist',
    type: WishlistResponseDto
  })
  getUserWishlist(@Request() req: any) {
    return this.wishlistService.getUserWishlist(req.user.userId);
  }
}
