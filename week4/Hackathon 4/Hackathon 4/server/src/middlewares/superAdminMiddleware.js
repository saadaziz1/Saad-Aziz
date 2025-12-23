const { sendError } = require('../utils/response');

const superAdminMiddleware = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return sendError(res, 403, 'Access denied. Super Admin privileges required.');
  }
  next();
};

module.exports = { superAdminMiddleware };