import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { UsersService } from '../users/users.service';
import { ProductService } from '../products/products.service';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class CartService {

  /**
   * Inject Cart MongoDB model
   */
  constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,
    private usersService: UsersService,
    private productService: ProductService,
  ) { }

  private async checkUserRole(userId: string) {
    const user = await this.usersService.findById(userId);
    if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException('Admins and Super Admins are not allowed to have a personal cart');
    }
  }

  /**
   * Get or create cart for user
   */
  async getUserCart(userId: string) {
    let cart = await this.cartModel.findOne({ userId }).populate('items.productId');

    if (!cart) {
      cart = await this.cartModel.create({
        userId,
        items: [],
      });
    }

    return cart;
  }

  /**
   * Add item to cart with variant support
   */
  async addItem(
    userId: string,
    productId: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string,
    payWithPoints: boolean = false,
  ) {
    await this.checkUserRole(userId);

    // Verify product exists
    await this.productService.findById(productId);

    const cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      await this.cartModel.create({ userId, items: [] });
      return this.addItem(userId, productId, quantity, selectedColor, selectedSize, payWithPoints);
    }

    const existingItem = cart.items.find(
      item =>
        item.productId.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize &&
        item.payWithPoints === payWithPoints,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(productId),
        quantity,
        selectedColor,
        selectedSize,
        payWithPoints,
      });
    }

    await cart.save();
    return this.getUserCart(userId);
  }

  /**
   * Update item quantity in cart
   */
  async updateItem(
    userId: string,
    productId: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string,
    payWithPoints?: boolean,
  ) {
    await this.checkUserRole(userId);
    const cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = cart.items.find(
      item =>
        item.productId.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize,
    );

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    item.quantity = quantity;
    if (payWithPoints !== undefined) {
      item.payWithPoints = payWithPoints;
    }
    await cart.save();
    return this.getUserCart(userId);
  }

  /**
   * Remove item from cart
   */
  async removeItem(
    userId: string,
    productId: string,
    selectedColor?: string,
    selectedSize?: string,
  ) {
    const cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = cart.items.filter(
      item =>
        !(item.productId.toString() === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize),
    );

    await cart.save();
    return this.getUserCart(userId);
  }

  /**
   * Clear entire cart
   */
  async clearCart(userId: string) {
    return this.cartModel.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true },
    );
  }
}
