import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Protected - current user's own profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getCurrentUserProfile(@CurrentUser() user: any) {
    return this.userService.getProfile(user.id);
  }

  // Public - anyone can view profiles by ID
  @Get('profile/:id')
  async getProfile(@Param('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllUsers(@CurrentUser() user: any) {
    return this.userService.getAllUsers(user.id);
  }

  // Protected - only authenticated users can modify
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateData: { username?: string; email?: string; bio?: string; profilePicture?: string }
  ) {
    return this.userService.updateProfile(user.id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('follow/:userId')
  async followUser(@CurrentUser() user: any, @Param('userId') targetUserId: string) {
    return this.userService.followUser(user.id, targetUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('follow/:userId')
  async unfollowUser(@CurrentUser() user: any, @Param('userId') targetUserId: string) {
    return this.userService.unfollowUser(user.id, targetUserId);
  }
}