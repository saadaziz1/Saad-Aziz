import { Router } from 'express';
import { TaskController } from './task.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();
const taskController = new TaskController();

router.use(authMiddleware);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get all user tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *                   title:
 *                     type: string
 *                     example: "Complete project documentation"
 *                   description:
 *                     type: string
 *                     example: "Write comprehensive API documentation"
 *                   completed:
 *                     type: boolean
 *                     example: false
 *                   userId:
 *                     type: string
 *                     example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *                   createdAt:
 *                     type: string
 *                     example: "2023-09-06T10:30:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     example: "2023-09-06T10:30:00.000Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access denied. No token provided."
 */
router.get('/', taskController.getAllTasks);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Complete project documentation"
 *               description:
 *                 type: string
 *                 example: "Write comprehensive API documentation"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *                 title:
 *                   type: string
 *                   example: "Complete project documentation"
 *                 description:
 *                   type: string
 *                   example: "Write comprehensive API documentation"
 *                 completed:
 *                   type: boolean
 *                   example: false
 *                 userId:
 *                   type: string
 *                   example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *                 createdAt:
 *                   type: string
 *                   example: "2023-09-06T10:30:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   example: "2023-09-06T10:30:00.000Z"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task title is required"
 *       401:
 *         description: Unauthorized
 */
router.post('/', taskController.createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Update a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *                 title:
 *                   type: string
 *                   example: "Complete project documentation"
 *                 description:
 *                   type: string
 *                   example: "Write comprehensive API documentation"
 *                 completed:
 *                   type: boolean
 *                   example: true
 *                 userId:
 *                   type: string
 *                   example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *                 createdAt:
 *                   type: string
 *                   example: "2023-09-06T10:30:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   example: "2023-09-06T11:45:00.000Z"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 */
router.put('/:id', taskController.updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *         description: Task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 */
router.delete('/:id', taskController.deleteTask);

export { router as taskRoutes };