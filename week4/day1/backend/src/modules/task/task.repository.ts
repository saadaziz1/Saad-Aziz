import { Task, ITaskDocument } from '../models/task.model.js';
import { CreateTaskDto, UpdateTaskDto } from './task.types.js';

export class TaskRepository {
  async findByUserId(userId: string): Promise<ITaskDocument[]> {
    return Task.find({ userId }).sort({ createdAt: -1 });
  }

  async create(taskData: CreateTaskDto & { userId: string }): Promise<ITaskDocument> {
    const task = new Task(taskData);
    return task.save();
  }

  async updateByUserAndId(id: string, updateData: UpdateTaskDto, userId: string): Promise<ITaskDocument | null> {
    return Task.findOneAndUpdate({ _id: id, userId }, updateData, { new: true });
  }

  async deleteByUserAndId(id: string, userId: string): Promise<ITaskDocument | null> {
    return Task.findOneAndDelete({ _id: id, userId });
  }
}