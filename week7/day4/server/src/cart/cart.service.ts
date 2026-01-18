import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cart } from "./Schema/cart.schema";
import { Model } from "mongoose";

@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private cart: Model<Cart>) { }

    async getCart(userId: string) {
        const cart = await this.cart.findOne({ userId });
        return cart || { items: [] };
    }

    async addItem(userId: string, product: any) {
        let cart = await this.cart.findOne({ userId });

        if (!cart) {
            cart = await this.cart.create({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(i => i.productId === product.id);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity++;
        } else {
            cart.items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image?.[0]?.url || '',
                quantity: 1
            });
        }

        await cart.save();
        return cart;
    }

    async updateQty(userId: string, productId: string, qty: number) {
        const cart = await this.cart.findOne({ userId });
        if (!cart) return null;

        const itemIndex = cart.items.findIndex(i => i.productId === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = qty;
            if (qty <= 0) {
                cart.items.splice(itemIndex, 1);
            }
        }

        await cart.save();
        return cart;
    }

    async removeItem(userId: string, productId: string) {
        const cart = await this.cart.findOne({ userId });
        if (!cart) return null;

        cart.items = cart.items.filter(i => i.productId !== productId);

        await cart.save();
        return cart;
    }
}
