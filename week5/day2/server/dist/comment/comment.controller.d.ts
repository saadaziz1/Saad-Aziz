import { CommentService } from './comment.service';
export declare class CommentController {
    private commentService;
    constructor(commentService: CommentService);
    getComments(): Promise<(import("mongoose").FlattenMaps<import("../schemas/comment.schema").Comment> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    createComment(user: any, createCommentDto: {
        content: string;
        parentComment?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../schemas/comment.schema").Comment, {}, {}> & import("../schemas/comment.schema").Comment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    likeComment(user: any, commentId: string): Promise<{
        liked: boolean;
        likesCount: number;
    }>;
}
