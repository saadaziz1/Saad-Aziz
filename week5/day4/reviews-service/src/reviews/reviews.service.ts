import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) {}

  async createReview(userId: string, dto: CreateReviewDto) {
    const review = await this.reviewModel.create({
      userId,
      productId: dto.productId,
      content: dto.content,
      plainText: dto.plainText,
      mentions: dto.mentions || [],
      rating: dto.rating,
      replies: [],
      likes: [],
    });
    return review;
  }

  async getReviewById(reviewId: string) {
    return this.reviewModel.findById(reviewId)
      .populate('userId', 'name email role')
      .populate('replies.userId', 'name email role');
  }

  async addReply(reviewId: string, userId: string, dto: ReplyReviewDto) {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    review.replies.push({ 
      userId, 
      content: dto.content, 
      plainText: dto.plainText,
      mentions: dto.mentions || [],
      createdAt: new Date() 
    });
    await review.save();
    
    return this.reviewModel.findById(reviewId)
      .populate('userId', 'name email role')
      .populate('replies.userId', 'name email role');
  }

  async likeReview(reviewId: string, userId: string) {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    const likeIndex = review.likes.indexOf(userId);
    if (likeIndex > -1) {
      // Unlike: remove user from likes array
      review.likes.splice(likeIndex, 1);
    } else {
      // Like: add user to likes array
      review.likes.push(userId);
    }
    
    await review.save();
    
    return this.reviewModel.findById(reviewId)
      .populate('userId', 'name email role')
      .populate('replies.userId', 'name email role');
  }

  async getReviewsByProduct(productId: string) {
    return this.reviewModel.find({ productId })
      .populate('userId', 'name email role')
      .populate('replies.userId', 'name email role')
      .sort({ createdAt: -1 });
  }
}