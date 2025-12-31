import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;

  constructor(private readonly configService: ConfigService) {}

  handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error('No token');

      const secret = this.configService.get<string>('jwtSecret');
      if (!secret) throw new Error('JWT secret not configured');

      const payload: any = jwt.verify(token, secret);
      socket.join(payload.id); // room per user
      console.log(`Socket connected: ${payload.id}`);
    } catch (err) {
      console.log('Socket auth failed:', err.message);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    console.log('Socket disconnected');
  }

  broadcastNewReview(review: any, excludeUserId?: string) {
    console.log('Broadcasting new review to all users');
    // Always broadcast to everyone for UI updates, handle notification exclusion on frontend
    this.server.emit('newReview', { ...review, excludeUserId });
  }

  notifyUser(userId: string, payload: any) {
    console.log(`Sending direct notification to user ${userId}:`, payload);
    if (payload.type === 'review-reply') {
      this.server.to(userId).emit('reviewReply', payload);
    } else if (payload.type === 'review-like') {
      this.server.to(userId).emit('reviewLike', payload);
    } else if (payload.type === 'review-mention') {
      this.server.to(userId).emit('reviewMention', payload);
    } else if (payload.type === 'reply-mention') {
      this.server.to(userId).emit('replyMention', payload);
    }
  }
}