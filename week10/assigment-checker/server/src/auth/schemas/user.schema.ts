import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password?: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, enum: ['student', 'teacher', 'moderator'], default: 'student' })
    role: string;

    @Prop({ default: false })
    isBlocked: boolean;

    @Prop()
    rollNumber?: string; // Optional for teachers and moderators
}

export const UserSchema = SchemaFactory.createForClass(User);
