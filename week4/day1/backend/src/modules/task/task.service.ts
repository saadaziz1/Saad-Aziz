import { TaskRepository } from './task.repository.js';
import { CreateTaskDto, UpdateTaskDto, ITask } from './task.types.js';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getAllTasks(userId: string): Promise<ITask[]> {
    return this.taskRepository.findByUserId(userId);
  }

  async createTask(taskData: CreateTaskDto & { userId: string }): Promise<ITask> {
    if (!taskData.title?.trim()) {
      throw new Error('Task title is required');
    }
    return this.taskRepository.create(taskData);
  }

  async updateTask(id: string, updateData: UpdateTaskDto, userId: string): Promise<ITask> {
    const task = await this.taskRepository.updateByUserAndId(id, updateData, userId);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    const task = await this.taskRepository.deleteByUserAndId(id, userId);
    if (!task) {
      throw new Error('Task not found');
    }
  }
}