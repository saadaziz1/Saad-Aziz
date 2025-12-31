import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) { }

  async create(data: Partial<Notification>): Promise<Notification> {
    const notification = new this.notificationModel(data);
    return notification.save();
  }

  async createForAll(data: Omit<Partial<Notification>, 'userId'>) {
    try {
      const users = await this.userModel.find({}, '_id');
      this.logger.log(`[createForAll] Found ${users.length} users to notify. Content: "${data.message}"`);

      if (users.length === 0) {
        this.logger.warn('[createForAll] No users found in database!');
        return;
      }

      // Log a few IDs to check format
      this.logger.log(`[createForAll] Sample User IDs: ${users.slice(0, 5).map((u: any) => u._id.toString()).join(', ')}`);

      const notifications = users.map(user => ({
        ...data,
        userId: user._id,
        isRead: false,
      }));

      const result = await this.notificationModel.insertMany(notifications);
      this.logger.log(`[createForAll] Successfully inserted ${result.length} notifications`);
    } catch (error) {
      this.logger.error(`[createForAll] Error: ${error.message}`, error.stack);
    }
  }

  async findByUser(userId: string): Promise<Notification[]> {
    try {
      this.logger.log(`[findByUser] Fetching notifications for user: ${userId}`);
      const query: any = { userId: new Types.ObjectId(userId) };
      const results = await this.notificationModel
        .find(query)
        .sort({ createdAt: -1 })
        .populate('auctionId')
        .exec();
      this.logger.log(`[findByUser] Found ${results.length} notifications`);
      return results;
    } catch (error) {
      this.logger.error(`[findByUser] Error: ${error.message}`);
      return [];
    }
  }

  async markAsRead(id: string) {
    return this.notificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );
  }

  async markAllAsRead(userId: string) {
    const query = { userId: new Types.ObjectId(userId), isRead: false };
    return this.notificationModel.updateMany(
      query,
      { $set: { isRead: true } }
    );
  }

  async remove(id: string) {
    return this.notificationModel.findByIdAndDelete(id);
  }
}
