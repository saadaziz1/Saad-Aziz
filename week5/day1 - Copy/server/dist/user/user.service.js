"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async getProfile(userId) {
        const user = await this.userModel
            .findById(userId)
            .select('-password')
            .populate('followers', 'username')
            .populate('following', 'username');
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            id: user._id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture,
            followersCount: user.followers.length,
            followingCount: user.following.length,
            followers: user.followers,
            following: user.following
        };
    }
    async getAllUsers(currentUserId) {
        const users = await this.userModel
            .find(currentUserId ? { _id: { $ne: currentUserId } } : {})
            .select('username bio profilePicture followers')
            .limit(20);
        return users.map(user => ({
            id: user._id,
            username: user.username,
            bio: user.bio,
            profilePicture: user.profilePicture,
            followersCount: user.followers.length,
            isFollowing: currentUserId ? user.followers.includes(currentUserId) : false
        }));
    }
    async updateProfile(userId, updateData) {
        if (updateData.username || updateData.email) {
            const existingUser = await this.userModel.findOne({
                _id: { $ne: userId },
                $or: [
                    ...(updateData.username ? [{ username: updateData.username }] : []),
                    ...(updateData.email ? [{ email: updateData.email }] : [])
                ]
            });
            if (existingUser) {
                throw new Error('Username or email already exists');
            }
        }
        const user = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        return {
            id: user._id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture,
            followersCount: user.followers.length
        };
    }
    async followUser(currentUserId, targetUserId) {
        if (currentUserId === targetUserId) {
            throw new Error('Cannot follow yourself');
        }
        await this.userModel.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });
        const updatedUser = await this.userModel.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } }, { new: true });
        return {
            message: 'User followed successfully',
            followersCount: updatedUser.followers.length
        };
    }
    async unfollowUser(currentUserId, targetUserId) {
        await this.userModel.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
        await this.userModel.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
        return { message: 'User unfollowed successfully' };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map