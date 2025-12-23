import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationType } from '../schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>
  ) {}

  async createNotification(
    recipientId: string,
    senderId: string,
    type: NotificationType,
    message: string,
    commentId?: string
  ) {
    const notification = new this.notificationModel({
      recipient: recipientId,
      sender: senderId,
      type,
      message,
      comment: commentId,
    });

    await notification.save();
    
    return this.notificationModel
      .findById(notification._id)
      .populate('sender', 'username profilePicture')
      .populate('comment', 'content');
  }

  async getAllNotifications() {
    try {
      // Clean up any invalid notifications with "public-user"
      await this.notificationModel.deleteMany({
        $or: [
          { recipient: 'public-user' },
          { sender: 'public-user' }
        ]
      });
      
      return this.notificationModel
        .find()
        .populate('sender', 'username profilePicture')
        .populate('comment', 'content')
        .sort({ createdAt: -1 })
        .limit(100);
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
      return [];
    }
  }

  async getUserNotifications(userId: string) {
    return this.notificationModel
      .find({ recipient: userId })
      .populate('sender', 'username profilePicture')
      .populate('comment', 'content')
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationModel.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );
  }

  async getUnreadCount(userId: string) {
    return this.notificationModel.countDocuments({
      recipient: userId,
      read: false
    });
  }
}