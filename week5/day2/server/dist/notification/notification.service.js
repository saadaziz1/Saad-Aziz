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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("../schemas/notification.schema");
let NotificationService = class NotificationService {
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
    }
    async createNotification(recipientId, senderId, type, message, commentId) {
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
        }
        catch (error) {
            console.error('Error fetching notifications:', error.message);
            return [];
        }
    }
    async getUserNotifications(userId) {
        return this.notificationModel
            .find({ recipient: userId })
            .populate('sender', 'username profilePicture')
            .populate('comment', 'content')
            .sort({ createdAt: -1 })
            .limit(50);
    }
    async markAsRead(notificationId, userId) {
        return this.notificationModel.findOneAndUpdate({ _id: notificationId, recipient: userId }, { read: true }, { new: true });
    }
    async markAllAsRead(userId) {
        return this.notificationModel.updateMany({ recipient: userId, read: false }, { read: true });
    }
    async getUnreadCount(userId) {
        return this.notificationModel.countDocuments({
            recipient: userId,
            read: false
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationService);
//# sourceMappingURL=notification.service.js.map