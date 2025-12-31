import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import { NotificationsService } from './notifications.service';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: "*",
        credentials: true,
    },
})
@Injectable()
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(NotificationsGateway.name);

    constructor(
        @Inject(forwardRef(() => NotificationsService))
        private readonly notificationService: NotificationsService,
    ) { }

    afterInit(server: Server) {
        this.logger.log('🚀 NotificationsGateway initialized');
        this.server = server;
    }

    handleConnection(client: Socket) {
        this.logger.log(`🔗 Client connected: ${client.id}`);
        // Log total connected clients
        this.server.fetchSockets().then(sockets => {
            this.logger.log(`📈 Total connected clients: ${sockets.length}`);
        });
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`🔌 Client disconnected: ${client.id}`);
    }

    /**
     * Broadcast to ALL connected clients that an auction has started.
     */
    async notifyAllAuctionStart(auctionId: string, carTitle: string) {
        this.logger.log(`📣 notifyAllAuctionStart: ${carTitle} (${auctionId})`);
        const message = `Auction for "${carTitle}" has started!`;

        try {
            // Persist for all users
            await this.notificationService.createForAll({
                type: 'auctionStart',
                message: message,
                auctionId: new Types.ObjectId(auctionId),
            });
            this.logger.log(`✅ Persisted notification for all users`);

            // Emit to global namespace
            const payload = {
                type: 'auctionStart',
                title: 'Auction Started',
                message: message,
                auctionId: auctionId,
                timestamp: new Date(),
            };
            this.server.emit('notification', payload);
            this.logger.log(`📡 Emitted 'notification' event globally`);
        } catch (error) {
            this.logger.error(`❌ Error in notifyAllAuctionStart: ${error.message}`);
        }
    }

    /**
     * Broadcast to ALL connected clients that an auction has ended.
     */
    async notifyAllAuctionEnd(auctionId: string, carTitle: string) {
        this.logger.log(`📣 notifyAllAuctionEnd: ${carTitle} (${auctionId})`);
        const message = `Auction for "${carTitle}" has ended.`;

        try {
            // Persist for all users
            await this.notificationService.createForAll({
                type: 'auctionEnd',
                message: message,
                auctionId: new Types.ObjectId(auctionId),
            });
            this.logger.log(`✅ Persisted notification for all users`);

            const payload = {
                type: 'auctionEnd',
                title: 'Auction Ended',
                message: message,
                auctionId: auctionId,
                timestamp: new Date(),
            };
            this.server.emit('notification', payload);
            this.logger.log(`📡 Emitted 'notification' event globally`);
        } catch (error) {
            this.logger.error(`❌ Error in notifyAllAuctionEnd: ${error.message}`);
        }
    }
}
