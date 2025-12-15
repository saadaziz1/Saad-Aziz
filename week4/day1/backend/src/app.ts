import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

import { taskRoutes } from './modules/task/task.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import { errorHandler } from './modules/middlewares/error.middleware.js';
import swaggerSpec from './docs/swagger.js';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger JSON
app.get('/swagger.json', (_req: Request, res: Response) => {
  res.json(swaggerSpec);
});

// Swagger HTML (Vercel-safe)
app.get('/api-docs', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'public', 'swagger.html'));
});

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use(errorHandler);

export default app;
