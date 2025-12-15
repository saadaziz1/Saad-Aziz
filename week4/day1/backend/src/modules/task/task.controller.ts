import { Request, Response } from 'express';
import { TaskService } from './task.service.js';

interface AuthRequest extends Request {
  userId?: string;
}

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  getAllTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const tasks = await this.taskService.getAllTasks(req.userId!);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  };

  createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.createTask({ ...req.body, userId: req.userId });
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.updateTask(req.params.id!, req.body, req.userId!);
      res.json(task);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };

  deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.taskService.deleteTask(req.params.id!, req.userId!);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };
}