import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../../common/enums/role.enum';

/**
 * MongoDB document type
 */
export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

  /** User display name */
  @Prop({ required: true })
  name: string;

  /** Unique email */
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  /** Phone number */
  @Prop()
  phone?: string;

  /** Address */
  @Prop()
  address?: string;

  /** Hashed password */
  @Prop({ select: false })
  password?: string;

  /** OAuth provider (google, github, discord, local) */
  @Prop({ default: 'local' })
  provider: string;

  /** OAuth provider user ID */
  @Prop()
  providerId?: string;

  /** User profile picture URL */
  @Prop()
  avatar?: string;

  /** Role for RBAC */
  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  /** Loyalty points balance */
  @Prop({ default: 0 })
  loyaltyPoints: number;

  /** Soft delete / account suspension */
  @Prop({ default: true })
  isActive: boolean;

  /** Track total money spent (future analytics) */
  @Prop({ default: 0 })
  totalSpent: number;

  /** Track total orders count */
  @Prop({ default: 0 })
  totalOrders: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
