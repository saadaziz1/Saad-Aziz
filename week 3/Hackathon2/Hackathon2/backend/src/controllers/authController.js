import { authService } from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return errorResponse(res, 'Name, email, and password are required', 400);
      }

      const result = await authService.register({ name, email, password });
      successResponse(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return errorResponse(res, 'Email and password are required', 400);
      }

      const result = await authService.login(email, password);
      successResponse(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req, res, next) {
    try {
      const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      };
      successResponse(res, { user }, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const token = authService.generateToken(req.user._id);
      successResponse(res, { token }, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }
};