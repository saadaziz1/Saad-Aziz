import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;
  
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp';
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};