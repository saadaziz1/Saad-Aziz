const { validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendError, sendSuccess } = require('../utils/response');

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, errors.array()[0].msg);
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'User already exists');
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken({ id: user._id });

    sendSuccess(res, 'User registered successfully', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, errors.array()[0].msg);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 400, 'Invalid credentials');
    }

    if (user.isBlocked) {
      return sendError(res, 403, 'Account is blocked');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 400, 'Invalid credentials');
    }

    const token = generateToken({ id: user._id });

    sendSuccess(res, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      }
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('subscription.planId');
    sendSuccess(res, 'Profile retrieved successfully', user);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

module.exports = { register, login, getProfile };