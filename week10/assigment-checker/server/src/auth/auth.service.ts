import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async signup(userData: any): Promise<any> {
        const { email, password, firstName, lastName, role } = userData;

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        let rollNumber = userData.rollNumber;
        if (role === 'student') {
            // Auto-generate unique immutable roll number
            const timestamp = Date.now().toString().slice(-4);
            const random = Math.floor(1000 + Math.random() * 9000);
            rollNumber = `STD-${timestamp}-${random}`;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            rollNumber,
        });

        await user.save();

        // Return user without password
        const result = user.toObject();
        delete result.password;
        return result;
    }

    async login(loginData: any): Promise<any> {
        const { email, password } = loginData;
        const user = await this.userModel.findOne({ email });

        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.isBlocked) {
            throw new UnauthorizedException('Your account has been blocked by a moderator');
        }

        if (user.role === 'student' && !user.rollNumber) {
            const timestamp = Date.now().toString().slice(-4);
            const random = Math.floor(1000 + Math.random() * 9000);
            user.rollNumber = `STD-${timestamp}-${random}`;
            await user.save();
        }

        const payload = {
            email: user.email,
            sub: user._id,
            role: user.role,
            name: `${user.firstName} ${user.lastName}`
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role,
                rollNumber: user.rollNumber,
            },
        };
    }
}
