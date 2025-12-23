import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(payload: any): Promise<{
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
export {};
