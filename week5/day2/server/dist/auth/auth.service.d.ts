import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { RegisterDto, LoginDto } from './auth.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            username: string;
            email: string;
            bio: string;
            profilePicture: string;
            followersCount: number;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            username: string;
            email: string;
            bio: string;
            profilePicture: string;
            followersCount: number;
        };
    }>;
    validateUser(userId: string): Promise<{
        id: string;
        _id: import("mongoose").Types.ObjectId;
        username: string;
        email: string;
        bio: string;
        profilePicture: string;
        followers: import("mongoose").Types.ObjectId[];
        following: import("mongoose").Types.ObjectId[];
    }>;
}
