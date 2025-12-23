const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return sendError(res, 401, 'Access denied. No token provided.');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return sendError(res, 401, 'Invalid token.');
    }

    if (user.isBlocked) {
      return sendError(res, 403, 'Account is blocked.');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 401, 'Invalid token.');
  }
};

module.exports = authMiddleware;