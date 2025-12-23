import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  // Public - anyone can view comments
  @Get()
  async getComments() {
    return this.commentService.getAllComments();
  }

  // Protected - only authenticated users can create/like
  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @CurrentUser() user: any,
    @Body() createCommentDto: { content: string; parentComment?: string }
  ) {
    return this.commentService.createComment(user.id, createCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likeComment(@CurrentUser() user: any, @Param('id') commentId: string) {
    return this.commentService.likeComment(user.id, commentId);
  }
}