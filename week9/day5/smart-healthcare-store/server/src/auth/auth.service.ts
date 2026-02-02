import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async signup(signupDto: SignupDto): Promise<{ token: string; user: any }> {
        const { name, email, password } = signupDto;

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new UnauthorizedException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({
            name,
            email,
            passwordHash: hashedPassword,
        });

        const token = this.jwtService.sign({ id: user._id });
        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    }

    async login(loginDto: LoginDto): Promise<{ token: string; user: any }> {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordMatched = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const token = this.jwtService.sign({ id: user._id });
        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    }
}
