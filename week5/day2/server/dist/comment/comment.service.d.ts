import { Model } from 'mongoose';
import { Comment } from '../schemas/comment.schema';
import { CreateCommentDto } from './comment.dto';
export declare class CommentService {
    private commentModel;
    constructor(commentModel: Model<Comment>);
    createComment(userId: string, createCommentDto: CreateCommentDto): Promise<import("mongoose").Document<unknown, {}, Comment, {}, {}> & Comment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllComments(): Promise<(import("mongoose").FlattenMaps<Comment> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getCommentById(commentId: string): Promise<import("mongoose").Document<unknown, {}, Comment, {}, {}> & Comment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    likeComment(userId: string, commentId: string): Promise<{
        liked: boolean;
        likesCount: number;
    }>;
    deleteComment(userId: string, commentId: string): Promise<{
        message: string;
    }>;
}
