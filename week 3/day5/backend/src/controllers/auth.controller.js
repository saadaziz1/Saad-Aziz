const asyncHandler = require('express-async-handler');
const authService = require('../services/auth.service');

// Signup
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await authService.register({ name, email, password });
  res.status(201).json({ success: true, user: { id: user._id, name: user.name, role: user.role }, token });
});

// Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });
  res.status(200).json({ success: true, user: { id: user._id, name: user.name, role: user.role }, token });
});

// Get current user
const me = asyncHandler(async (req, res) => {
  const user = req.user; // attached by authMiddleware
  res.status(200).json({ success: true, user });
});

module.exports = { signup, login, me };
