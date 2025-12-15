import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../auth/auth.types.js';

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUserDocument>('User', userSchema);