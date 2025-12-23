import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
}
