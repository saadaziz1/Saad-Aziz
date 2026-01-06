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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cart')
export class CartController {

  constructor(private readonly cartService: CartService) { }

  /**
   * Get logged-in user's cart
   */
  @Get()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Get current user cart (User only)' })
  @ApiResponse({ status: 200, description: 'Return user cart.' })
  getCart(@Request() req) {
    return this.cartService.getUserCart(req.user.userId);
  }

  /**
   * Add product to cart with variants
   */
  @Post('add')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Add item to cart (User only)' })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully.' })
  addToCart(@Request() req, @Body() dto: AddToCartDto) {
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
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Update cart item quantity (User only)' })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({ status: 200, description: 'Cart updated successfully.' })
  updateCart(@Request() req, @Body() dto: UpdateCartDto) {
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
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Remove item from cart (User only)' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully.' })
  removeItem(
    @Request() req,
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
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Clear entire cart (User only)' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully.' })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}
