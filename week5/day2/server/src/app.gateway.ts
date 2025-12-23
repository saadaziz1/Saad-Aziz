import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentService } from './comment/comment.service';
import { NotificationService } from './notification/notification.service';
import { UserService } from './user/user.service';
import { NotificationType } from './schemas/notification.schema';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(
    private commentService: CommentService,
    private notificationService: NotificationService,
    private userService: UserService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Remove user from active sockets
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    this.userSockets.set(data.userId, client.id);
    client.join(`user_${data.userId}`);
    console.log(`User ${data.userId} joined room user_${data.userId}`);
    console.log('Active user sockets:', Array.from(this.userSockets.keys()));
  }

  @SubscribeMessage('new_comment')
  async handleNewComment(
    @MessageBody() data: { content: string; parentComment?: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const comment = await this.commentService.createComment(data.userId, {
        content: data.content,
        parentComment: data.parentComment,
      });

      // Broadcast new comment to all users
      if (!data.parentComment) {
        this.server.emit('comment_created', comment);
        
        // Create notifications for all users except the author
        const users = await this.userService.getAllUsers();
        const author = await this.userService.getProfile(data.userId);
        
        for (const user of users) {
          // Skip notifying the comment author
          if (user.id.toString() !== data.userId) {
            const notification = await this.notificationService.createNotification(
              user.id.toString(),
              data.userId,
              NotificationType.NEW_COMMENT,
              `${author.username} posted a new comment`,
              comment._id.toString()
            );
            
            this.server.to(`user_${user.id}`).emit('notification', notification);
          }
        }
      } else {
        // It's a reply - notify only the parent comment author
        const parentComment = await this.commentService.getCommentById(data.parentComment);
        console.log('Reply - Parent comment author:', parentComment.author._id, 'Replier:', data.userId);
        
        if (parentComment.author._id.toString() !== data.userId) {
          const replier = await this.userService.getProfile(data.userId);
          const notification = await this.notificationService.createNotification(
            parentComment.author._id.toString(),
            data.userId,
            NotificationType.COMMENT_REPLY,
            `${replier.username} replied to your comment`,
            comment._id.toString()
          );
          
          console.log('Sending reply notification to room:', `user_${parentComment.author._id}`);
          this.server.to(`user_${parentComment.author._id}`).emit('notification', notification);
        }
        
        this.server.emit('reply_created', comment);
      }

      return comment;
    } catch (error) {
      console.error('Error creating comment:', error);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('like_comment')
  async handleLikeComment(
    @MessageBody() data: { commentId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = await this.commentService.likeComment(data.userId, data.commentId);
      const comment = await this.commentService.getCommentById(data.commentId);
      
      // Broadcast like update
      this.server.emit('comment_liked', {
        commentId: data.commentId,
        liked: result.liked,
        likesCount: result.likesCount
      });

      // Notify comment author if liked (not unliked)
      if (result.liked && comment.author._id.toString() !== data.userId) {
        const liker = await this.userService.getProfile(data.userId);
        const notification = await this.notificationService.createNotification(
          comment.author._id.toString(),
          data.userId,
          NotificationType.COMMENT_LIKE,
          `${liker.username} liked your comment`,
          data.commentId
        );
        
        this.server.to(`user_${comment.author._id}`).emit('notification', notification);
      }

      return result;
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('get_comments')
  async handleGetComments() {
    return this.commentService.getAllComments();
  }
}