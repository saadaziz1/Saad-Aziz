import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signup(signupDto: SignupDto) {
        const existingUser = await this.usersService.findByEmail(signupDto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(signupDto.password, 10);
        const names = signupDto.fullName.split(' ');

        const user = await this.usersService.create({
            email: signupDto.email,
            password: hashedPassword,
            firstName: names[0] || '',
            lastName: names.slice(1).join(' ') || '',
            provider: 'local',
        });

        return {
            message: 'User registered successfully. Please log in.',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || user.provider !== 'local' || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user);
    }

    async googleLogin(req: any) {
        if (!req.user) {
            return 'No user from google';
        }

        const { email, firstName, lastName, picture } = req.user;

        let user = await this.usersService.findByEmail(email);

        if (user) {
            // Only update if current data is missing (initial sync) or if provider needs to be set
            const updateData: any = {};
            if (!user.firstName) updateData.firstName = firstName;
            if (!user.lastName) updateData.lastName = lastName;
            if (!user.picture) updateData.picture = picture;
            if (user.provider !== 'google') updateData.provider = 'google';

            if (Object.keys(updateData).length > 0) {
                user = await this.usersService.update(email, updateData);
            }
        } else {
            // Create new user from Google profile
            user = await this.usersService.create({
                email,
                firstName,
                lastName,
                picture,
                provider: 'google',
                isEmailVerified: true,
            });
        }

        return {
            message: 'User authenticated via Google',
            user,
            accessToken: this.jwtService.sign({ email: user?.email, sub: user?._id }),
        };
    }

    async updateProfile(userId: string, updateData: any) {
        if (updateData.email) {
            const existingUser = await this.usersService.findByEmail(updateData.email);
            if (existingUser && existingUser._id.toString() !== userId.toString()) {
                throw new ConflictException('Email already in use by another account');
            }
        }
        return this.usersService.updateById(userId, updateData);
    }

    private generateToken(user: any) {
        const payload = { email: user.email, sub: user._id };
        return {
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            accessToken: this.jwtService.sign(payload),
        };
    }
}
