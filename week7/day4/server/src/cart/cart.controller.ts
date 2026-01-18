import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { ProductsService } from 'src/products/products.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private cart: CartService,
    private products: ProductsService,
  ) { }

  @Get()
  getCart(@Request() req) {
    return this.cart.getCart(req.user.userId);
  }

  @Post()
  async add(@Body('productId') id: string, @Request() req) {
    const product = await this.products.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.cart.addItem(req.user.userId, product);
  }

  @Patch()
  update(@Body() body, @Request() req) {
    return this.cart.updateQty(req.user.userId, body.productId, body.qty);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.cart.removeItem(req.user.userId, id);
  }
}
