import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PDFDocument extends Document {
    @Prop({ required: true })
    filename: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    storageUrl?: string;

    @Prop()
    docType?: string;

    @Prop([String])
    themes?: string[];

    @Prop()
    summary?: string;
}

export const PDFDocumentSchema = SchemaFactory.createForClass(PDFDocument);
