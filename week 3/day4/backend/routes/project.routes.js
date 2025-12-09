const express = require('express');
const router = express.Router();
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/project.controller');
const { protect } = require('../middlewares/auth.middleware');
const { createProjectValidator, updateProjectValidator, idValidator } = require('../middlewares/validators');
const { validate } = require('../middlewares/validate.middleware');



/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects for current user
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Projects fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getAllProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project fetched successfully
 *       404:
 *         description: Project not found
 */
router.get('/:id', protect, idValidator, validate, getProjectById);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     description: >
 *       Creates a new project.  
 *       **Note:** The `members` array is optional.  
 *       If provided, each member must already exist in the database.  
 *       Use their MongoDB `_id` from the Members collection.  
 *       Attempting to add a non-existent member will result in a 400 error.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - techStack
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Website Redesign"
 *               description:
 *                 type: string
 *                 example: "Revamp company website for better UX"
 *               techStack:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["React", "Express", "Node"]
 *               status:
 *                 type: string
 *                 enum: [active, completed]
 *                 example: "active"
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: "MongoDB ObjectId of an existing member"
 *                 example: ["651f6a8b4d2b3c0012345678", "651f6a8b4d2b3c0012345679"]
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error or member does not exist
 */
router.post('/', protect, createProjectValidator, validate, createProject);
/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     description: >
 *       Updates a project by ID.  
 *       All fields are optional.  
 *       If the `members` array is provided, each member must already exist in the database.  
 *       Use their MongoDB `_id` from the Members collection.  
 *       Attempting to add a non-existent member will result in a 400 error.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "651f7a8c4d2b3c001234567a"
 *         description: The MongoDB ID of the project to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Project Title"
 *               description:
 *                 type: string
 *                 example: "Updated description for the project"
 *               techStack:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["React", "Node", "Express"]
 *               status:
 *                 type: string
 *                 enum: [active, completed]
 *                 example: "completed"
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: "MongoDB ObjectId of an existing member"
 *                 example: ["651f6a8b4d2b3c0012345678", "651f6a8b4d2b3c0012345679"]
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Validation error or member does not exist
 *       404:
 *         description: Project not found
 */
router.put('/:id', protect, updateProjectValidator, validate, updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */
router.delete('/:id', protect, idValidator, validate, deleteProject);

module.exports = router;
