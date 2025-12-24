/**
 * roleMiddleware(...allowedRoles)
 * Checks if logged-in user has one of the allowed roles
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
    }

    next();
  };
};

module.exports = roleMiddleware;
