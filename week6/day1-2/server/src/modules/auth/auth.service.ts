import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Handles authentication logic
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // reuse Users module
    private jwtService: JwtService,
  ) { }

  /**
   * Register new user
   */
  async register(dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    await this.usersService.createUser(dto, hashedPassword);

    return {
      message: 'User registered successfully',
    };
  }

  /**
   * Login user
   */
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ForbiddenException('Account is suspended. Please contact support.');
    }

    // Check if user has a password (local vs social login)
    if (!user.password) {
      throw new UnauthorizedException('Please login with your social provider.');
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT payload
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Validate or create user from OAuth profile
   */
  async validateOAuthUser(profile: {
    email: string;
    name: string;
    avatar: string;
    provider: string;
    providerId: string;
  }) {
    let user = await this.usersService.findByEmail(profile.email);

    if (!user) {
      // Create new user if doesn't exist
      user = await this.usersService.createUser(
        {
          email: profile.email,
          name: profile.name,
        } as any,
        '', // No password for social users
      );
    }

    // Update provider info and avatar
    user.provider = profile.provider;
    user.providerId = profile.providerId;
    user.avatar = profile.avatar;
    await user.save();

    // Create JWT payload
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        provider: user.provider,
      },
    };
  }
}
