import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AssignmentDocument = Assignment & Document;

@Schema({ timestamps: true })
export class Assignment {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    instructions: string;

    @Prop({ required: true, enum: ['strict', 'loose'], default: 'strict' })
    markingMode: string;

    @Prop({ required: true })
    targetWordCount: number;

    @Prop({ required: true })
    deadline: Date;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    teacherId: Types.ObjectId;

    @Prop({ type: [String], default: [] })
    focusAreas: string[];

    @Prop({ default: false })
    autoEvaluation: boolean;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
