import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signup(@Body() userData: SignupDto) {
        return this.authService.signup(userData);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginData: LoginDto) {
        return this.authService.login(loginData);
    }
}
