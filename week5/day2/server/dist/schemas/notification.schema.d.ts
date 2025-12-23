import { Document, Types } from 'mongoose';
export declare enum NotificationType {
    NEW_COMMENT = "new_comment",
    COMMENT_REPLY = "comment_reply",
    COMMENT_LIKE = "comment_like",
    NEW_FOLLOWER = "new_follower"
}
export declare class Notification extends Document {
    recipient: Types.ObjectId;
    sender: Types.ObjectId;
    type: NotificationType;
    comment: Types.ObjectId;
    message: string;
    read: boolean;
}
export declare const NotificationSchema: import("mongoose").Schema<Notification, import("mongoose").Model<Notification, any, any, any, Document<unknown, any, Notification, any, {}> & Notification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, import("mongoose").FlatRecord<Notification>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Notification> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
