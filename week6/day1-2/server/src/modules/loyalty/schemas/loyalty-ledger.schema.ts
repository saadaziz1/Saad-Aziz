import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LoyaltyLedgerDocument = LoyaltyLedger & Document;

export enum LedgerType {
    EARN = 'EARN',
    SPEND = 'SPEND',
    REFUND = 'REFUND',
    EXPIRE = 'EXPIRE',
}

@Schema({ timestamps: true })
export class LoyaltyLedger {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: String, enum: LedgerType, required: true })
    type: LedgerType;

    @Prop({ required: true })
    points: number;

    @Prop({ type: Types.ObjectId, ref: 'Order' })
    orderId?: Types.ObjectId;

    @Prop()
    description: string;
}

export const LoyaltyLedgerSchema = SchemaFactory.createForClass(LoyaltyLedger);
