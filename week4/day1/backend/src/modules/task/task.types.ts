export interface ITask {
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

export interface UpdateTaskDto {
  completed: boolean;
}