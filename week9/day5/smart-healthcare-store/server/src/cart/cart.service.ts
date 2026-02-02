import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        private productsService: ProductsService,
    ) { }

    private async getOrCreateCart(sessionId: string): Promise<CartDocument> {
        let cart = await this.cartModel.findOne({ sessionId });
        if (!cart) {
            cart = await this.cartModel.create({ sessionId, items: [], total: 0 });
        }
        return cart;
    }

    private calculateTotal(items: Cart['items']): number {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    async getCart(sessionId: string): Promise<Cart> {
        return this.getOrCreateCart(sessionId);
    }

    async addToCart(sessionId: string, productId: string, quantity: number = 1): Promise<Cart> {
        const cart = await this.getOrCreateCart(sessionId);
        const product = await this.productsService.findOne(productId);

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const existingItem = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                productId: new Types.ObjectId(productId),
                name: product.name,
                price: product.price,
                quantity,
                image: product.image,
            });
        }

        cart.total = this.calculateTotal(cart.items);
        await cart.save();
        return cart;
    }

    async updateQuantity(sessionId: string, productId: string, quantity: number): Promise<Cart> {
        const cart = await this.getOrCreateCart(sessionId);
        const item = cart.items.find(item => item.productId.toString() === productId);

        if (!item) {
            throw new NotFoundException('Item not found in cart');
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        } else {
            item.quantity = quantity;
        }

        cart.total = this.calculateTotal(cart.items);
        await cart.save();
        return cart;
    }

    async removeFromCart(sessionId: string, productId: string): Promise<Cart> {
        const cart = await this.getOrCreateCart(sessionId);
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.total = this.calculateTotal(cart.items);
        await cart.save();
        return cart;
    }

    async clearCart(sessionId: string): Promise<Cart> {
        const cart = await this.getOrCreateCart(sessionId);
        cart.items = [];
        cart.total = 0;
        await cart.save();
        return cart;
    }
}
