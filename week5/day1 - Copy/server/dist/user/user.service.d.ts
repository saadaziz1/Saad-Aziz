import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<User>);
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
    getAllUsers(currentUserId?: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        username: string;
        bio: string;
        profilePicture: string;
        followersCount: number;
        isFollowing: boolean;
    }[]>;
    updateProfile(userId: string, updateData: {
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
    followUser(currentUserId: string, targetUserId: string): Promise<{
        message: string;
        followersCount: number;
    }>;
    unfollowUser(currentUserId: string, targetUserId: string): Promise<{
        message: string;
    }>;
}
