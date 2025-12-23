const { z } = require('zod');

const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      
      const errors = err.issues.map(e => ({
        field: e.path.join('.') || 'unknown',
        message: e.message
      }));
      return res.status(400).json({ success: false, errors });
    }
    next(err);
  }
};

module.exports = validateRequest;
