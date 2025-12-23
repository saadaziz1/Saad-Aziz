import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getProfile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .populate('followers', 'username')
      .populate('following', 'username');
    
    if (!user) {
      throw new NotFoundException('User not found');
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

  async getAllUsers(currentUserId?: string) {
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
      isFollowing: currentUserId ? user.followers.includes(currentUserId as any) : false
    }));
  }

  async updateProfile(userId: string, updateData: { username?: string; email?: string; bio?: string; profilePicture?: string }) {
    // Check if username or email already exists (if being updated)
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

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      followersCount: user.followers.length
    };
  }

  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new Error('Cannot follow yourself');
    }

    await this.userModel.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { following: targetUserId } }
    );

    const updatedUser = await this.userModel.findByIdAndUpdate(
      targetUserId,
      { $addToSet: { followers: currentUserId } },
      { new: true }
    );

    return { 
      message: 'User followed successfully',
      followersCount: updatedUser.followers.length
    };
  }

  async unfollowUser(currentUserId: string, targetUserId: string) {
    await this.userModel.findByIdAndUpdate(
      currentUserId,
      { $pull: { following: targetUserId } }
    );

    await this.userModel.findByIdAndUpdate(
      targetUserId,
      { $pull: { followers: currentUserId } }
    );

    return { message: 'User unfollowed successfully' };
  }
}