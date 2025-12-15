import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { RegisterDto, LoginDto, AuthResponse } from './auth.types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  async register(userData: RegisterDto): Promise<AuthResponse> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      ...userData,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      token
    };
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      token
    };
  }

  verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }
}