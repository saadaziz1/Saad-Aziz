// src/middlewares/errorHandler.js

// notFound middleware
const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
};

// central error handler
const errorHandler = (err, req, res, next) => {
  console.error(err); // in prod, replace with a logger
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message,
    // only include stack in dev
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = { notFound, errorHandler };
