import { Controller, Get, Post, Body, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';

import { GoogleAuthGuard } from './guards/google-auth.guard';

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
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const result = await this.authService.googleLogin(req);

        console.log('--- Google Auth Redirect Debug ---');
        console.log('process.env.FRONTEND_URL:', process.env.FRONTEND_URL);
        console.log('process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

        // Robust fallback: Env Var -> Hardcoded Prod -> Localhost
        const frontendUrl = process.env.FRONTEND_URL;

        console.log('Final frontendUrl:', frontendUrl);

        if (typeof result === 'string') {
            return res.redirect(`${frontendUrl}/login?error=auth_failed`);
        }

        // Set token in cookie (for same-domain local dev/testing)
        res.cookie('token', result.accessToken, {
            httpOnly: false,
            secure: true, // Always true for sameSite=none
            sameSite: 'none', // Needed for cross-site if we relied on cookies (but we'll use URL param)
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Pass token in URL for cross-domain (Render -> Vercel)
        res.redirect(`${frontendUrl}/google-callback?token=${result.accessToken}`);
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
