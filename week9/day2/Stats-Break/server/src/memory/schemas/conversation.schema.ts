import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ _id: false })
class Message {
    @Prop({ required: true, enum: ['user', 'assistant'] })
    role: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: Object })
    payload?: any; // For tables or structured data

    @Prop({ default: Date.now })
    timestamp: Date;
}

const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class Conversation {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    userId: Types.ObjectId;

    @Prop({ default: 'New Conversation' })
    title: string;

    @Prop({ type: [MessageSchema], default: [] })
    messages: Message[];

    @Prop({ type: String })
    lastSummary?: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
