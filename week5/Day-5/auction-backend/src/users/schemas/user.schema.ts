import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true, unique: true })
  mobileNumber: string;

  @Prop()
  profilePicture?: string;

  // Personal Information
  @Prop()
  nationality?: string;

  @Prop()
  idType?: string;

  @Prop()
  idNumber?: string;

  // Address Information
  @Prop()
  address1?: string;

  @Prop()
  address2?: string;

  @Prop()
  city?: string;

  @Prop()
  poBox?: string;

  @Prop()
  country?: string;

  @Prop()
  landline?: string;

  // Traffic/Vehicle Information
  @Prop()
  trafficType?: string;

  @Prop()
  trafficFileNumber?: string;

  @Prop()
  plateNumber?: string;

  @Prop()
  issueCity?: string;

  @Prop()
  driverLicenseNumber?: string;

  @Prop()
  plateCode?: string;

  @Prop()
  plateState?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
