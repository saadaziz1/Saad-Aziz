import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class Submission {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Assignment' })
    assignmentId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ required: true })
    studentName: string;

    @Prop({ required: true })
    rollNumber: string;

    @Prop({ required: true })
    content: string; // Extracted text from PDF

    @Prop({ required: true })
    fileUrl: string; // Cloudinary URL

    @Prop({ required: true })
    score: number;

    @Prop({ required: true })
    remarks: string;

    @Prop({ type: Object })
    breakdown: Record<string, number>;

    @Prop({ default: false })
    isManualEntry: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
