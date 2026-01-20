import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../products/schema/product.schema';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderItem {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    product: Types.ObjectId | Product;

    @Prop({ required: true, min: 1 })
    quantity: number;

    @Prop({ required: true, min: 0 })
    priceAtSale: number;
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: [OrderItem], required: true })
    items: OrderItem[];

    @Prop({ required: true, min: 0 })
    totalAmount: number;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    processedBy: Types.ObjectId;

    @Prop({ enum: ['IN_STORE', 'PICKUP', 'SHIPPING'], default: 'IN_STORE' })
    type: string;

    @Prop({ enum: ['Pending', 'Preparing', 'Completed'], default: 'Completed' })
    status: string;

    @Prop({ default: 'Credit Card' })
    paymentMethod: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
