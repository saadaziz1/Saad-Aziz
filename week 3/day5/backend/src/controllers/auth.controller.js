const asyncHandler = require('express-async-handler');
const authService = require('../services/auth.service');

// Signup
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await authService.register({ name, email, password });
  res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
});

// Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });
  res.status(200).json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
});

// Get current user
const me = asyncHandler(async (req, res) => {
  const user = req.user; // attached by authMiddleware

  res.status(200).json({ success: true, user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked
  } });
});

// Update profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const userRepository = require('../repositories/userRepository');
  
  // Check if email is already taken by another user
  if (email) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
  }
  
  const updatedUser = await userRepository.updateById(req.user.id, { name, email });
  res.status(200).json({ success: true, user: updatedUser });
});

module.exports = { signup, login, me, updateProfile };
