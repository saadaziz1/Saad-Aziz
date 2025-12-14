import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { jwtConfig } from '../config/jwtConfig.js';

export const authService = {
  async register(userData) {
    const { name, email, password } = userData;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await User.create({ name, email, password });
    const token = this.generateToken(user._id, user.role);
    
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  },

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }

    if (user.isBlocked) {
      throw new Error('Account is blocked. Contact support.');
    }

    const token = this.generateToken(user._id, user.role);
    
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  },

  generateToken(userId, role) {
    return jwt.sign({ id: userId, role }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });
  },

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      const user = await User.findById(decoded.id).select('-password');
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};