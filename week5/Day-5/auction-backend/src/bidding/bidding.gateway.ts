import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
})
export class BiddingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('BiddingGateway');

  handleConnection(client: Socket) {
    console.log(`🔗 Client connected: ${client.id}`);
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 Client disconnected: ${client.id}`);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinAuction')
  handleJoinAuction(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `auction-${data.auctionId}`;

    // Check if client is already in the room
    if (client.rooms.has(roomName)) {
      return; // Already in room, don't join again
    }

    client.join(roomName);
    console.log(`🏠 Client ${client.id} joined auction room: ${roomName}`);
    this.logger.log(`Client ${client.id} joined auction ${data.auctionId}`);
  }

  @SubscribeMessage('leaveAuction')
  handleLeaveAuction(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `auction-${data.auctionId}`;
    client.leave(roomName);
    console.log(`💪 Client ${client.id} left auction room: ${roomName}`);
    this.logger.log(`Client ${client.id} left auction ${data.auctionId}`);
  }

  emitNewBid(auctionId: string, bidData: any) {
    const roomName = `auction-${auctionId}`;
    console.log(`📡 Emitting newBid to room ${roomName}:`, bidData);
    console.log(`👥 Clients in room:`, this.server.sockets.adapter.rooms.get(roomName)?.size || 0);

    this.server.to(roomName).emit('newBid', bidData);
    this.logger.log(`Emitted newBid to auction ${auctionId}`);
  }

  emitAuctionStart(auctionId: string, auctionData: any) {
    console.log(`🏁 Emitting auctionStart for ${auctionId}:`, auctionData);
    this.server.emit('auctionStart', { auctionId, ...auctionData });
  }

  emitAuctionEnd(auctionId: string, winnerData: any) {
    const roomName = `auction-${auctionId}`;
    console.log(`🏆 Emitting auctionEnd to room ${roomName}:`, winnerData);
    this.server.to(roomName).emit('auctionEnd', winnerData);
    this.server.emit('auctionEnded', { auctionId, ...winnerData });
  }

  emitBidWinner(auctionId: string, winnerData: any) {
    const roomName = `auction-${auctionId}`;
    console.log(`🏅 Emitting bidWinner to room ${roomName}:`, winnerData);
    this.server.to(roomName).emit('bidWinner', winnerData);
  }
}