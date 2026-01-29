import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ResearchDocumentStatus = 'pending' | 'ready' | 'failed';

@Schema({ timestamps: true })
export class ResearchDocument extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    topic: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    storageUrl?: string;

    @Prop({ default: 0 })
    wordCount: number;

    @Prop({ default: 'pending' })
    status: ResearchDocumentStatus;
}

export const ResearchDocumentSchema = SchemaFactory.createForClass(ResearchDocument);