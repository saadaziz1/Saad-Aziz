const User = require('../models/User');
const Video = require('../models/Video');
const Plan = require('../models/Plan');
const bcrypt = require('bcryptjs');
const { sendError, sendSuccess } = require('../utils/response');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('subscription.planId');
    sendSuccess(res, 'Users retrieved successfully', users);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin user
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    
    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;
    
    sendSuccess(res, 'Admin created successfully', adminResponse);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
    
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 'User blocked successfully', user);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
    
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 'User unblocked successfully', user);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const createPlan = async (req, res) => {
  try {
    const { name, price, duration, features } = req.body;
    
    const plan = new Plan({ name, price, duration, features });
    await plan.save();
    
    sendSuccess(res, 'Plan created successfully', plan);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    sendSuccess(res, 'Plans retrieved successfully', plans);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeSubscriptions = await User.countDocuments({ 'subscription.isActive': true });
    const totalVideos = await Video.countDocuments();
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    const stats = {
      totalUsers,
      activeSubscriptions,
      totalVideos,
      blockedUsers
    };

    sendSuccess(res, 'Dashboard stats retrieved successfully', stats);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

module.exports = { 
  getAllUsers, 
  createAdmin,
  blockUser, 
  unblockUser, 
  createPlan, 
  getAllPlans, 
  getDashboardStats 
};