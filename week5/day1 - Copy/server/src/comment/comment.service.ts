import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../schemas/comment.schema';
import { CreateCommentDto } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  async createComment(userId: string, createCommentDto: CreateCommentDto) {
    const { content, parentComment } = createCommentDto;
    
    const comment = new this.commentModel({
      author: userId,
      content,
      parentComment: parentComment || null,
    });

    await comment.save();

    // If it's a reply, add to parent's replies array
    if (parentComment) {
      await this.commentModel.findByIdAndUpdate(
        parentComment,
        { $push: { replies: comment._id } }
      );
    }

    return this.getCommentById(comment._id.toString());
  }

  async getAllComments() {
    try {
      console.log('Fetching comments from database...');
      
      // First, clean up any invalid comments with "public-user" author
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
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      return [];
    }
  }

  async getCommentById(commentId: string) {
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
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async likeComment(userId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const isLiked = comment.likes.includes(userId as any);
    
    if (isLiked) {
      // Unlike
      await this.commentModel.findByIdAndUpdate(commentId, {
        $pull: { likes: userId },
        $inc: { likesCount: -1 }
      });
      return { liked: false, likesCount: comment.likesCount - 1 };
    } else {
      // Like
      await this.commentModel.findByIdAndUpdate(commentId, {
        $addToSet: { likes: userId },
        $inc: { likesCount: 1 }
      });
      return { liked: true, likesCount: comment.likesCount + 1 };
    }
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    // Remove from parent's replies if it's a reply
    if (comment.parentComment) {
      await this.commentModel.findByIdAndUpdate(
        comment.parentComment,
        { $pull: { replies: commentId } }
      );
    }

    // Delete all replies
    await this.commentModel.deleteMany({ parentComment: commentId });
    
    // Delete the comment
    await this.commentModel.findByIdAndDelete(commentId);

    return { message: 'Comment deleted successfully' };
  }
}