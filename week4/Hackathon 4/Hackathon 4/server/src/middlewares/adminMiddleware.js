const { sendError } = require('../utils/response');

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return sendError(res, 403, 'Access denied. Admin privileges required.');
  }
  next();
};

module.exports = { adminMiddleware };