import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentService } from './comment/comment.service';
import { NotificationService } from './notification/notification.service';
import { UserService } from './user/user.service';
export declare class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private commentService;
    private notificationService;
    private userService;
    server: Server;
    private userSockets;
    constructor(commentService: CommentService, notificationService: NotificationService, userService: UserService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(data: {
        userId: string;
    }, client: Socket): void;
    handleNewComment(data: {
        content: string;
        parentComment?: string;
        userId: string;
    }, client: Socket): Promise<import("mongoose").Document<unknown, {}, import("./schemas/comment.schema").Comment, {}, {}> & import("./schemas/comment.schema").Comment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    handleLikeComment(data: {
        commentId: string;
        userId: string;
    }, client: Socket): Promise<{
        liked: boolean;
        likesCount: number;
    }>;
    handleGetComments(): Promise<(import("mongoose").FlattenMaps<import("./schemas/comment.schema").Comment> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
