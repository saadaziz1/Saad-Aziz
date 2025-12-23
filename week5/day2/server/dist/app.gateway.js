"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const comment_service_1 = require("./comment/comment.service");
const notification_service_1 = require("./notification/notification.service");
const user_service_1 = require("./user/user.service");
const notification_schema_1 = require("./schemas/notification.schema");
let AppGateway = class AppGateway {
    constructor(commentService, notificationService, userService) {
        this.commentService = commentService;
        this.notificationService = notificationService;
        this.userService = userService;
        this.userSockets = new Map();
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        for (const [userId, socketId] of this.userSockets.entries()) {
            if (socketId === client.id) {
                this.userSockets.delete(userId);
                break;
            }
        }
        console.log(`Client disconnected: ${client.id}`);
    }
    handleJoin(data, client) {
        this.userSockets.set(data.userId, client.id);
        client.join(`user_${data.userId}`);
        console.log(`User ${data.userId} joined room user_${data.userId}`);
        console.log('Active user sockets:', Array.from(this.userSockets.keys()));
    }
    async handleNewComment(data, client) {
        try {
            const comment = await this.commentService.createComment(data.userId, {
                content: data.content,
                parentComment: data.parentComment,
            });
            if (!data.parentComment) {
                this.server.emit('comment_created', comment);
                const users = await this.userService.getAllUsers();
                const author = await this.userService.getProfile(data.userId);
                for (const user of users) {
                    if (user.id.toString() !== data.userId) {
                        const notification = await this.notificationService.createNotification(user.id.toString(), data.userId, notification_schema_1.NotificationType.NEW_COMMENT, `${author.username} posted a new comment`, comment._id.toString());
                        this.server.to(`user_${user.id}`).emit('notification', notification);
                    }
                }
            }
            else {
                const parentComment = await this.commentService.getCommentById(data.parentComment);
                console.log('Reply - Parent comment author:', parentComment.author._id, 'Replier:', data.userId);
                if (parentComment.author._id.toString() !== data.userId) {
                    const replier = await this.userService.getProfile(data.userId);
                    const notification = await this.notificationService.createNotification(parentComment.author._id.toString(), data.userId, notification_schema_1.NotificationType.COMMENT_REPLY, `${replier.username} replied to your comment`, comment._id.toString());
                    console.log('Sending reply notification to room:', `user_${parentComment.author._id}`);
                    this.server.to(`user_${parentComment.author._id}`).emit('notification', notification);
                }
                this.server.emit('reply_created', comment);
            }
            return comment;
        }
        catch (error) {
            console.error('Error creating comment:', error);
            client.emit('error', { message: error.message });
        }
    }
    async handleLikeComment(data, client) {
        try {
            const result = await this.commentService.likeComment(data.userId, data.commentId);
            const comment = await this.commentService.getCommentById(data.commentId);
            this.server.emit('comment_liked', {
                commentId: data.commentId,
                liked: result.liked,
                likesCount: result.likesCount
            });
            if (result.liked && comment.author._id.toString() !== data.userId) {
                const liker = await this.userService.getProfile(data.userId);
                const notification = await this.notificationService.createNotification(comment.author._id.toString(), data.userId, notification_schema_1.NotificationType.COMMENT_LIKE, `${liker.username} liked your comment`, data.commentId);
                this.server.to(`user_${comment.author._id}`).emit('notification', notification);
            }
            return result;
        }
        catch (error) {
            client.emit('error', { message: error.message });
        }
    }
    async handleGetComments() {
        return this.commentService.getAllComments();
    }
};
exports.AppGateway = AppGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('new_comment'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "handleNewComment", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('like_comment'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "handleLikeComment", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_comments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "handleGetComments", null);
exports.AppGateway = AppGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
    }),
    __metadata("design:paramtypes", [comment_service_1.CommentService,
        notification_service_1.NotificationService,
        user_service_1.UserService])
], AppGateway);
//# sourceMappingURL=app.gateway.js.map