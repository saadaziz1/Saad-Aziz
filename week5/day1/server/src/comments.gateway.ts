//comments.gateway.ts
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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private comments: { userId: string; text: string; date: string }[] = [];
  private userMap: Map<string, string> = new Map(); // socket.id -> username
  private activeUsers: Set<string> = new Set(); // track unique usernames
  private userLastSeen: Map<string, number> = new Map(); // username -> timestamp

  constructor() {
    // Clean up inactive users every 30 seconds
    setInterval(() => {
      this.cleanupInactiveUsers();
    }, 30000);
  }

  private cleanupInactiveUsers() {
    const now = Date.now();
    const timeout = 60000; // 1 minute timeout
    
    for (const [username, lastSeen] of this.userLastSeen.entries()) {
      if (now - lastSeen > timeout) {
        this.activeUsers.delete(username);
        this.userLastSeen.delete(username);
        console.log(`🧹 Cleaned up inactive user: ${username}`);
      }
    }
  }

  handleConnection(client: Socket) {
    const username = (client.handshake.query.username as string) || `User${Math.random().toString(36).substr(2, 8)}`;
    
    // Clean up any existing connections for this user
    for (const [socketId, existingUsername] of this.userMap.entries()) {
      if (existingUsername === username && socketId !== client.id) {
        this.userMap.delete(socketId);
      }
    }
    
    this.userMap.set(client.id, username);
    this.activeUsers.add(username);
    this.userLastSeen.set(username, Date.now());
    
    console.log(`✅ User "${username}" connected (${client.id})`);
    console.log(`👥 Active users: ${this.activeUsers.size}, Total connections: ${this.userMap.size}`);
    console.log(`📊 Active user list: [${Array.from(this.activeUsers).join(', ')}]`);
  }

  handleDisconnect(client: Socket) {
    const username = this.userMap.get(client.id);
    this.userMap.delete(client.id);
    
    // Check if user still has other active connections
    const hasOtherConnections = Array.from(this.userMap.values()).includes(username!);
    if (!hasOtherConnections && username) {
      this.activeUsers.delete(username);
      this.userLastSeen.delete(username);
    }
    
    console.log(`❌ User "${username}" disconnected (${client.id})`);
    console.log(`👥 Active users: ${this.activeUsers.size}, Total connections: ${this.userMap.size}`);
    console.log(`📊 Active user list: [${Array.from(this.activeUsers).join(', ')}]`);
  }

  @SubscribeMessage('add_comment')
  handleNewComment(
    @MessageBody() comment: string,
    @ConnectedSocket() client: Socket,
  ) {
    const username = this.userMap.get(client.id) || client.id;
    const date = new Date().toISOString();
    const entry = { userId: username, text: comment, date };

    this.comments.unshift(entry);
    console.log(`💬 New comment from "${username}": ${comment.substring(0, 50)}${comment.length > 50 ? '...' : ''}`);

    // broadcast to all clients
    this.server.emit('new_comment', entry);
  }

  @SubscribeMessage('get_comments')
  handleGetComments() {
    return this.comments;
  }
}
