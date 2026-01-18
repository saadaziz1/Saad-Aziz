import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create(dto.email, hashedPassword, dto.name);

        const payload = { sub: user._id, email: user.email };
        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
            message: 'User registered successfully',
        };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user._id, email: user.email };
        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        };
    }

    async validateUser(userId: string) {
        return this.usersService.findById(userId);
    }
}
