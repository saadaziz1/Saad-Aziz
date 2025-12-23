import { Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  // Public - anyone can see all notifications
  @Get()
  async getAllNotifications() {
    return this.notificationService.getAllNotifications();
  }

  // Protected - only authenticated users can mark as read
  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  async markAsRead(@CurrentUser() user: any, @Param('id') notificationId: string) {
    return this.notificationService.markAsRead(notificationId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('mark-all-read')
  async markAllAsRead(@CurrentUser() user: any) {
    return this.notificationService.markAllAsRead(user.id);
  }
}