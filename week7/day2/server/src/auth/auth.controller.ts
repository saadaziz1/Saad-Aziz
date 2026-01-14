import { Controller, Get, Post, Body, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const result = await this.authService.googleLogin(req);
        const frontendUrl = 'http://localhost:3000';

        if (typeof result === 'string') {
            return res.redirect(`${frontendUrl}/login?error=auth_failed`);
        }

        // Set token in cookie
        res.cookie('token', result.accessToken, {
            httpOnly: false, // Set to false so frontend can read it for now (or use middleware)
            secure: false, // Set to true in production
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.redirect(`${frontendUrl}/dashboard`);
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req) {
        return req.user;
    }

    @Post('profile')
    @UseGuards(AuthGuard('jwt'))
    async updateProfile(@Req() req, @Body() updateData: any) {
        return this.authService.updateProfile(req.user.userId, updateData);
    }
}
