import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class CartItem {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ default: 1 })
    quantity: number;

    @Prop()
    image?: string;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId?: Types.ObjectId;

    @Prop({ required: true })
    sessionId: string; // For guest users

    @Prop({ type: [CartItemSchema], default: [] })
    items: CartItem[];

    @Prop({ default: 0 })
    total: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
