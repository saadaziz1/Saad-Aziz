// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * Attach user to req if token valid.
 * Usage: app.use('/api/protected', authMiddleware, protectedRoutes)
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.cookies?.token;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch full user data from database
    const userRepository = require('../repositories/userRepository');
    const user = await userRepository.findById(payload.id);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
