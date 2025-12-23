import { Document, Types } from 'mongoose';
export declare class Comment extends Document {
    author: Types.ObjectId;
    content: string;
    parentComment: Types.ObjectId;
    replies: Types.ObjectId[];
    likes: Types.ObjectId[];
    likesCount: number;
}
export declare const CommentSchema: import("mongoose").Schema<Comment, import("mongoose").Model<Comment, any, any, any, Document<unknown, any, Comment, any, {}> & Comment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comment, Document<unknown, {}, import("mongoose").FlatRecord<Comment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Comment> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
