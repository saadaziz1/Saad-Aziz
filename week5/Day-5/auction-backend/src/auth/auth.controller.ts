import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto, RegisterDto, LoginResponseDto, ErrorResponseDto } from './dto/auth.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'User Login',
    description: 'Authenticate user with username/email and password. Returns JWT access token and user information.'
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 400,
        message: ['Email or username is required', 'Password must be at least 6 characters long'],
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      }
    }
  })
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
  @ApiOperation({
    summary: 'User Registration',
    description: 'Create a new user account. Returns JWT access token and user information upon successful registration.'
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: LoginResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 400,
        message: 'Username, email or mobile number already exists',
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 409,
        message: 'Username already taken',
        error: 'Conflict'
      }
    }
  })
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

  @Public()
  @Post('check-username')
  @ApiOperation({
    summary: 'Check Username Availability',
    description: 'Check if a username is already taken.'
  })
  @ApiResponse({
    status: 200,
    description: 'Username availability status',
    schema: {
      example: {
        available: true
      }
    }
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'john_doe_99', description: 'The username to check for availability' }
      },
      required: ['username']
    }
  })
  async checkUsername(@Body('username') username: string) {
    if (!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }
    const available = await this.authService.checkUsername(username);
    return { available };
  }
}
