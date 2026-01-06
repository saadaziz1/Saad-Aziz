import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {

  constructor(private readonly cartService: CartService) { }

  /**
   * Get logged-in user's cart
   */
  @Get()
  getCart(@Req() req) {
    return this.cartService.getUserCart(req.user.userId);
  }

  /**
   * Add product to cart with variants
   */
  @Post('add')
  @ApiBody({ type: AddToCartDto })
  addToCart(@Req() req, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(
      req.user.userId,
      dto.productId,
      dto.quantity,
      dto.selectedColor,
      dto.selectedSize,
      dto.payWithPoints,
    );
  }

  /**
   * Update cart item quantity
   */
  @Patch('update')
  @ApiBody({ type: UpdateCartDto })
  updateCart(@Req() req, @Body() dto: UpdateCartDto) {
    return this.cartService.updateItem(
      req.user.userId,
      dto.productId,
      dto.quantity,
      dto.selectedColor,
      dto.selectedSize,
      dto.payWithPoints,
    );
  }

  /**
   * Remove item from cart
   */
  @Delete('remove/:productId')
  removeItem(
    @Req() req,
    @Param('productId') productId: string,
    @Query('color') color?: string,
    @Query('size') size?: string,
  ) {
    return this.cartService.removeItem(req.user.userId, productId, color, size);
  }

  /**
   * Clear entire cart
   */
  @Delete('clear')
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}
