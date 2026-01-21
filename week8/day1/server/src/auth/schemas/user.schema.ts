import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;


@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true }) // Changed to required true since no OAuth
  password: string;

  @Prop({ type: String, default: null })
  avatar?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
