import { Model } from 'mongoose';
import { Notification, NotificationType } from '../schemas/notification.schema';
export declare class NotificationService {
    private notificationModel;
    constructor(notificationModel: Model<Notification>);
    createNotification(recipientId: string, senderId: string, type: NotificationType, message: string, commentId?: string): Promise<import("mongoose").Document<unknown, {}, Notification, {}, {}> & Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllNotifications(): Promise<(import("mongoose").Document<unknown, {}, Notification, {}, {}> & Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getUserNotifications(userId: string): Promise<(import("mongoose").Document<unknown, {}, Notification, {}, {}> & Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    markAsRead(notificationId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, Notification, {}, {}> & Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    markAllAsRead(userId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    getUnreadCount(userId: string): Promise<number>;
}
