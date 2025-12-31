import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Get,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(@Request() req, @Body() dto: CreateReviewDto) {
    const review = await this.reviewsService.createReview(req.user.id, dto);
    const populatedReview = await this.reviewsService.getReviewById(review._id.toString());

    // Broadcast new review to all users except the author
    console.log('Broadcasting new review:', populatedReview);
    this.notificationsGateway.broadcastNewReview(populatedReview, req.user.id);

    // Send mention notifications
    if (dto.mentions?.length) {
      dto.mentions.forEach(mentionedUserId => {
        if (mentionedUserId !== req.user.id) {
          this.notificationsGateway.notifyUser(mentionedUserId, {
            type: 'review-mention',
            reviewId: review._id,
            mentionedBy: req.user.id,
            content: dto.plainText || dto.content,
          });
        }
      });
    }

    return populatedReview;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reply')
  async replyReview(@Request() req, @Param('id') id: string, @Body() dto: ReplyReviewDto) {
    const review = await this.reviewsService.addReply(id, req.user.id, dto);

    if (review) {
      // Broadcast reply update to all users for real-time UI updates
      console.log('Broadcasting reply update to all users');
      this.notificationsGateway.server.emit('reviewUpdate', review);
      
      // Only notify the review owner (direct notification)
      const ownerId = (review.userId as any)?._id?.toString() || review.userId?.toString();
      console.log('Reply - Review owner ID:', ownerId, 'Current user:', req.user.id);
      if (ownerId && ownerId !== req.user.id) {
        console.log('Sending reply notification to owner:', ownerId);
        this.notificationsGateway.notifyUser(ownerId, {
          type: 'review-reply',
          reviewId: review._id,
          replyUserId: req.user.id,
          content: dto.plainText || dto.content,
        });
      }

      // Send mention notifications for replies
      if (dto.mentions?.length) {
        dto.mentions.forEach(mentionedUserId => {
          if (mentionedUserId !== req.user.id && mentionedUserId !== ownerId) {
            this.notificationsGateway.notifyUser(mentionedUserId, {
              type: 'reply-mention',
              reviewId: review._id,
              mentionedBy: req.user.id,
              content: dto.plainText || dto.content,
            });
          }
        });
      }
    }

    return review;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likeReview(@Request() req, @Param('id') id: string) {
    const review = await this.reviewsService.likeReview(id, req.user.id);

    if (review) {
      // Broadcast like update to all users for real-time UI updates
      console.log('Broadcasting like update to all users');
      this.notificationsGateway.server.emit('reviewUpdate', review);
      
      // Only notify the review author if they were actually liked (not unliked)
      const ownerId = (review.userId as any)?._id?.toString() || review.userId?.toString();
      const wasLiked = review.likes.includes(req.user.id);
      
      if (wasLiked && ownerId && ownerId !== req.user.id) {
        console.log('Sending like notification to owner:', ownerId);
        this.notificationsGateway.notifyUser(ownerId, {
          type: 'review-like',
          reviewId: review._id,
          likeUserId: req.user.id,
        });
      }
    }

    return review;
  }

  @Get('product/:productId')
  async getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getReviewsByProduct(productId);
  }
}