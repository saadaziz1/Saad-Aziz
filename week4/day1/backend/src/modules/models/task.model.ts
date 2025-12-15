import mongoose, { Schema, Document } from 'mongoose';
import { ITask } from '../task/task.types.js';

export interface ITaskDocument extends ITask, Document {}

const taskSchema = new Schema<ITaskDocument>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Task = mongoose.model<ITaskDocument>('Task', taskSchema);