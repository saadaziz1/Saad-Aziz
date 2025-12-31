import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user', description: 'Authenticate user with username/email and password' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const validatedUser = await this.authService.validateUser(
      loginDto.identifier,
      loginDto.password,
    );
    if (!validatedUser) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.authService.findUserByIdentifier(
      loginDto.identifier,
    );
    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register user', description: 'Create a new user account' })
  @ApiResponse({ status: 201, description: 'User successfully registered, returns JWT access token' })
  @ApiResponse({ status: 400, description: 'Username, email or mobile number already exists' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(
        registerDto.username,
        registerDto.email,
        registerDto.password,
        registerDto.fullName,
        registerDto.mobileNumber,
        registerDto.countryCode,
      );
      // After registration, get the full user document for login
      const fullUser = await this.authService.findUserByIdentifier(
        registerDto.username,
      );
      if (!fullUser) {
        throw new HttpException(
          'Registration failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return this.authService.login(fullUser);
    } catch (error) {
      if (error instanceof HttpException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Username, email or mobile number already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
