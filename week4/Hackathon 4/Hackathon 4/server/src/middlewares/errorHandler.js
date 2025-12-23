const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return sendError(res, 400, errors.join(', '));
  }

  if (err.code === 11000) {
    return sendError(res, 400, 'Duplicate field value entered');
  }

  if (err.name === 'CastError') {
    return sendError(res, 400, 'Invalid ID format');
  }

  return sendError(res, 500, 'Internal server error');
};

module.exports = errorHandler;