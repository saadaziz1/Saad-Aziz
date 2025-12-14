const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const ApiError = require('../utils/apiError'); // we’ll create this next

// Signup
const register = async ({ name, email, password }) => {
  // Check if email exists
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, 'Email already registered');

  const passwordHash = await hashPassword(password);

  const user = await User.create({ name, email, passwordHash });
  const token = signToken({ id: user._id, role: user.role });
  return { user, token };
};

// Login
const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid credentials');
  if (user.isBlocked) throw new ApiError(403, 'User is blocked');

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  const token = signToken({ id: user._id, role: user.role });
  return { user, token };
};

module.exports = { register, login };
