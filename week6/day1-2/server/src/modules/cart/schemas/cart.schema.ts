import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Cart MongoDB document type
 */
export type CartDocument = Cart & Document;

/**
 * Each cart belongs to ONE user
 */
@Schema({ timestamps: true })
export class Cart {

    /**
     * Reference to User document
     */
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: Types.ObjectId;

    /**
     * Array of cart items
     */
    @Prop([
        {
            productId: { type: Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1, min: 1 },
            selectedColor: { type: String },
            selectedSize: { type: String },
            payWithPoints: { type: Boolean, default: false },
        },
    ])
    items: {
        productId: Types.ObjectId;
        quantity: number;
        selectedColor?: string;
        selectedSize?: string;
        payWithPoints: boolean;
    }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
