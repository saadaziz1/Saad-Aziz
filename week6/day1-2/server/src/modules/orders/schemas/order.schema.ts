import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus } from '../../../common/enums/order-status.enum';

/**
 * MongoDB document type for Order
 */
export type OrderDocument = Order & Document;

/**
 * Order schema definition
 */
@Schema({ timestamps: true })
export class Order {

    /**
     * Reference to User who placed the order
     */
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    /**
     * Ordered items snapshot
     * (price stored to avoid future price changes)
     */
    @Prop([
        {
            productId: { type: Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            paidWithPoints: { type: Boolean, default: false },
            selectedColor: { type: String },
            selectedSize: { type: String },
        },
    ])
    items: {
        productId: Types.ObjectId;
        quantity: number;
        price: number;
        paidWithPoints: boolean;
        selectedColor?: string;
        selectedSize?: string;
    }[];

    /**
     * Total amount paid in money
     */
    @Prop({ default: 0 })
    totalAmount: number;

    /**
     * Total loyalty points spent
     */
    @Prop({ default: 0 })
    pointsUsed: number;

    /**
     * Total loyalty points to be earned upon payment success
     */
    @Prop({ default: 0 })
    pointsEarned: number;

    /**
     * Order status lifecycle
     */
    @Prop({
        type: String,
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    /**
     * Shipping address
     */
    @Prop({
        type: {
            firstName: { type: String },
            email: { type: String },
            address: { type: String },
            city: { type: String },
            postalCode: { type: String },
            phone: { type: String },
        },
        required: false,
    })
    shippingAddress?: {
        firstName: string;
        email: string;
        address: string;
        city: string;
        postalCode: string;
        phone: string;
    };

    /**
     * Payment information
     */
    @Prop({
        type: {
            method: { type: String, enum: ['card', 'points'], default: 'card' },
            cardHolderName: { type: String },
            cardNumber: { type: String },
            expiryDate: { type: String },
            stripePaymentIntentId: { type: String, index: true, unique: true, sparse: true },
        },
        required: false,
    })
    paymentInfo?: {
        method: string;
        cardHolderName?: string;
        cardNumber?: string;
        expiryDate?: string;
        stripePaymentIntentId?: string;
    };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
