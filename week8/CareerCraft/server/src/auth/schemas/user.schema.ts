import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;


@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, required: false, default: null })
  password?: string | null;

  @Prop({ type: String, default: null })
  otp?: string | null;

  @Prop({ type: Date, default: null })
  otpExpiry?: Date | null;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ default: null })
  lastOtpSent?: Date;

  @Prop({ type: String, default: null })
  googleId?: string | null;

  @Prop({ type: String, default: null })
  githubId?: string | null;

  @Prop({ type: String, default: null })
  avatar?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
