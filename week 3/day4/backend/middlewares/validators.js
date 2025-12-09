const { body, param } = require('express-validator');

// Auth Validators
exports.registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.loginValidator = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required')
];

// Member Validators
exports.createMemberValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('skills').isArray({ min: 1 }).withMessage('Skills must be an array with at least one skill'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('phone').trim().notEmpty().withMessage('Phone is required').matches(/^[0-9+\-\s()]+$/).withMessage('Invalid phone format')
];

exports.updateMemberValidator = [
  param('id').isMongoId().withMessage('Invalid member ID'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('role').optional().trim().notEmpty().withMessage('Role cannot be empty'),
  body('skills').optional().isArray({ min: 1 }).withMessage('Skills must be an array with at least one skill'),
  body('email').optional().trim().isEmail().withMessage('Invalid email format'),
  body('phone').optional().trim().matches(/^[0-9+\-\s()]+$/).withMessage('Invalid phone format')
];

exports.idValidator = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

// Project Validators
exports.createProjectValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('techStack').isArray({ min: 1 }).withMessage('Tech stack must be an array with at least one technology'),
  body('status').optional().isIn(['active', 'completed']).withMessage('Status must be either active or completed'),
  body('members').optional().isArray().withMessage('Members must be an array').custom((arr) => {
    if (arr && arr.length > 0) {
      for (let id of arr) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error('Invalid member ID in array');
        }
      }
    }
    return true;
  })
];

exports.updateProjectValidator = [
  param('id').isMongoId().withMessage('Invalid project ID'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('techStack').optional().isArray({ min: 1 }).withMessage('Tech stack must be an array with at least one technology'),
  body('status').optional().isIn(['active', 'completed']).withMessage('Status must be either active or completed'),
  body('members').optional().isArray().withMessage('Members must be an array').custom((arr) => {
    if (arr && arr.length > 0) {
      for (let id of arr) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error('Invalid member ID in array');
        }
      }
    }
    return true;
  })
];
