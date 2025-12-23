import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../schemas/user.schema';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password, bio } = registerDto;
    
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = new this.userModel({
      username,
      email,
      password: hashedPassword,
      bio: bio || ''
    });

    await user.save();
    
    const token = this.jwtService.sign({ userId: user._id });
    
    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount: user.followers.length
      }
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user._id });
    
    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount: user.followers.length
      }
    };
  }

  async validateUser(userId: string) {
    console.log('AuthService - validating user ID:', userId);
    
    try {
      const user = await this.userModel.findById(userId).select('-password');
      if (!user) {
        console.log('User not found in database');
        return null;
      }
      
      console.log('User found:', user.username);
      return {
        id: user._id.toString(),
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following
      };
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  }
}