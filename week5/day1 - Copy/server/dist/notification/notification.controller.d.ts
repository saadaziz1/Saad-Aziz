import { NotificationService } from './notification.service';
export declare class NotificationController {
    private notificationService;
    constructor(notificationService: NotificationService);
    getAllNotifications(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/notification.schema").Notification, {}, {}> & import("../schemas/notification.schema").Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    markAsRead(user: any, notificationId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/notification.schema").Notification, {}, {}> & import("../schemas/notification.schema").Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    markAllAsRead(user: any): Promise<import("mongoose").UpdateWriteOpResult>;
}
