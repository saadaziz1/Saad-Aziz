import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Product' })
  productId: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  plainText?: string;

  @Prop({ type: [Types.ObjectId], default: [] })
  mentions: string[];

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ type: [{ 
    userId: { type: Types.ObjectId, ref: 'User' }, 
    content: String, 
    plainText: String,
    mentions: [{ type: Types.ObjectId, ref: 'User' }],
    createdAt: Date 
  }] })
  replies: Array<{ userId: string; content: string; plainText?: string; mentions?: string[]; createdAt: Date }>;

  @Prop({ type: [Types.ObjectId], default: [] })
  likes: string[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
