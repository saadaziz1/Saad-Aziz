import { Controller, Post, Body, Get, UseGuards, Req, Res, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OAuthExceptionFilter } from '../../common/filters/oauth-exception.filter';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard, DiscordAuthGuard } from './guards/oauth.guards';

/**
 * Auth endpoints
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * Register endpoint
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * Login endpoint
   */
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // --- Google OAuth ---
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Login with Google' })
  googleAuth() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @UseFilters(OAuthExceptionFilter)
  async googleAuthCallback(@Req() req, @Res() res) {
    const result = await this.authService.validateOAuthUser(req.user);
    this.redirectWithToken(res, result.accessToken);
  }

  // --- GitHub OAuth ---
  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Login with GitHub' })
  githubAuth() { }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @UseFilters(OAuthExceptionFilter)
  async githubAuthCallback(@Req() req, @Res() res) {
    const result = await this.authService.validateOAuthUser(req.user);
    this.redirectWithToken(res, result.accessToken);
  }

  // --- Discord OAuth ---
  @Get('discord')
  @UseGuards(DiscordAuthGuard)
  @ApiOperation({ summary: 'Login with Discord' })
  discordAuth() { }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  @UseFilters(OAuthExceptionFilter)
  async discordAuthCallback(@Req() req, @Res() res) {
    const result = await this.authService.validateOAuthUser(req.user);
    this.redirectWithToken(res, result.accessToken);
  }

  private redirectWithToken(res, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
}
