import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(userId: string, type: string, payload: any) {
    return this.notificationModel.create({ userId, type, payload });
  }

  async getUserNotifications(userId: string) {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(notificationId, { read: true });
  }
}