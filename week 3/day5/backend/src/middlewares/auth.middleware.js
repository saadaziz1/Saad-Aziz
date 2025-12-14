// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * Attach user to req if token valid.
 * Usage: app.use('/api/protected', authMiddleware, protectedRoutes)
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.cookies?.token;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload should contain user id and role later
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
