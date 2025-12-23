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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("../schemas/comment.schema");
let CommentService = class CommentService {
    constructor(commentModel) {
        this.commentModel = commentModel;
    }
    async createComment(userId, createCommentDto) {
        const { content, parentComment } = createCommentDto;
        const comment = new this.commentModel({
            author: userId,
            content,
            parentComment: parentComment || null,
        });
        await comment.save();
        if (parentComment) {
            await this.commentModel.findByIdAndUpdate(parentComment, { $push: { replies: comment._id } });
        }
        return this.getCommentById(comment._id.toString());
    }
    async getAllComments() {
        try {
            console.log('Fetching comments from database...');
            await this.commentModel.deleteMany({ author: 'public-user' });
            const comments = await this.commentModel
                .find({ parentComment: null })
                .populate('author', 'username profilePicture')
                .populate({
                path: 'replies',
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            })
                .sort({ createdAt: -1 })
                .lean();
            console.log(`Found ${comments.length} comments`);
            return comments;
        }
        catch (error) {
            console.error('Error fetching comments:', error.message);
            return [];
        }
    }
    async getCommentById(commentId) {
        const comment = await this.commentModel
            .findById(commentId)
            .populate('author', 'username profilePicture')
            .populate({
            path: 'replies',
            populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        return comment;
    }
    async likeComment(userId, commentId) {
        const comment = await this.commentModel.findById(commentId);
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        const isLiked = comment.likes.includes(userId);
        if (isLiked) {
            await this.commentModel.findByIdAndUpdate(commentId, {
                $pull: { likes: userId },
                $inc: { likesCount: -1 }
            });
            return { liked: false, likesCount: comment.likesCount - 1 };
        }
        else {
            await this.commentModel.findByIdAndUpdate(commentId, {
                $addToSet: { likes: userId },
                $inc: { likesCount: 1 }
            });
            return { liked: true, likesCount: comment.likesCount + 1 };
        }
    }
    async deleteComment(userId, commentId) {
        const comment = await this.commentModel.findById(commentId);
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.author.toString() !== userId) {
            throw new Error('Unauthorized');
        }
        if (comment.parentComment) {
            await this.commentModel.findByIdAndUpdate(comment.parentComment, { $pull: { replies: commentId } });
        }
        await this.commentModel.deleteMany({ parentComment: commentId });
        await this.commentModel.findByIdAndDelete(commentId);
        return { message: 'Comment deleted successfully' };
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommentService);
//# sourceMappingURL=comment.service.js.map