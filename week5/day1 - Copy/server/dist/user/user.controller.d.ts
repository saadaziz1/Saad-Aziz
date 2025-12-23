import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getCurrentUserProfile(user: any): Promise<{
        id: import("mongoose").Types.ObjectId;
        username: string;
        email: string;
        bio: string;
        profilePicture: string;
        followersCount: number;
        followingCount: number;
        followers: import("mongoose").Types.ObjectId[];
        following: import("mongoose").Types.ObjectId[];
    }>;
    getProfile(userId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        username: string;
        email: string;
        bio: string;
        profilePicture: string;
        followersCount: number;
        followingCount: number;
        followers: import("mongoose").Types.ObjectId[];
        following: import("mongoose").Types.ObjectId[];
    }>;
    getAllUsers(user: any): Promise<{
        id: import("mongoose").Types.ObjectId;
        username: string;
        bio: string;
        profilePicture: string;
        followersCount: number;
        isFollowing: boolean;
    }[]>;
    updateProfile(user: any, updateData: {
        username?: string;
        email?: string;
        bio?: string;
        profilePicture?: string;
    }): Promise<{
        id: import("mongoose").Types.ObjectId;
        username: string;
        email: string;
        bio: string;
        profilePicture: string;
        followersCount: number;
    }>;
    followUser(user: any, targetUserId: string): Promise<{
        message: string;
        followersCount: number;
    }>;
    unfollowUser(user: any, targetUserId: string): Promise<{
        message: string;
    }>;
}
