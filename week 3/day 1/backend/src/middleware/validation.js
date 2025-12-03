/**
 * Request validation middleware
 */

const validateTask = (req, res, next) => {
    const { title, completed } = req.body;
    const errors = [];
    
    
    if (req.method === 'POST') {
        if (!title) {
            errors.push('Title is required');
        } else if (typeof title !== 'string') {
            errors.push('Title must be a string');
        } else if (title.trim().length === 0) {
            errors.push('Title cannot be empty');
        }
    }
    
    if (req.method === 'PUT' && title !== undefined) {
        if (typeof title !== 'string') {
            errors.push('Title must be a string');
        } else if (title.trim().length === 0) {
            errors.push('Title cannot be empty');
        }
    }
    
    // Validate completed field if provided
    if (completed !== undefined && typeof completed !== 'boolean') {
        errors.push('Completed must be a boolean');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }
    
    next();
};

module.exports = {
    validateTask
};