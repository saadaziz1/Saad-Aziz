import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const joinedRoomsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!socketRef.current) {
            console.log('🔗 useSocket: Connecting to', SOCKET_URL);
            const socket = io(SOCKET_URL, {
                transports: ['websocket', 'polling'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 1000,
                timeout: 5000,
            });
            socketRef.current = socket;

            socketRef.current.on('connect', () => {
                console.log('✅ useSocket: Connected with ID:', socketRef.current?.id);
                setIsConnected(true);
                joinedRoomsRef.current.clear();
            });

            socketRef.current.on('connect_error', (error) => {
                console.error('❌ useSocket: Connection error:', error.message);
                setIsConnected(false);
            });

            socketRef.current.on('disconnect', (reason) => {
                console.log('🔌 useSocket: Disconnected:', reason);
                setIsConnected(false);
                joinedRoomsRef.current.clear();
            });
        }

        return () => {
            if (socketRef.current) {
                console.log('🧹 useSocket: Cleaning up socket connection');
                socketRef.current.disconnect();
                socketRef.current = null;
                joinedRoomsRef.current.clear();
                setIsConnected(false);
            }
        };
    }, []);

    const joinAuction = useCallback((auctionId: string) => {
        if (socketRef.current?.connected && !joinedRoomsRef.current.has(auctionId)) {
            console.log(`🏠 useSocket: Joining auction ${auctionId}`);
            socketRef.current.emit('joinAuction', { auctionId });
            joinedRoomsRef.current.add(auctionId);
        }
    }, []);

    const leaveAuction = useCallback((auctionId: string) => {
        if (socketRef.current?.connected && joinedRoomsRef.current.has(auctionId)) {
            console.log(`💪 useSocket: Leaving auction ${auctionId}`);
            socketRef.current.emit('leaveAuction', { auctionId });
            joinedRoomsRef.current.delete(auctionId);
        }
    }, []);

    const onNewBid = (callback: (data: any) => void) => {
        if (socketRef.current) {
            console.log('👂 useSocket: Setting up newBid listener');
            socketRef.current.on('newBid', (data) => {
                console.log('📨 useSocket: Received newBid:', data);
                callback(data);
            });
        }
    };

    const onAuctionStart = (callback: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.on('auctionStart', callback);
        }
    };

    const onAuctionEnd = (callback: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.on('auctionEnd', callback);
        }
    };

    const onBidWinner = (callback: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.on('bidWinner', callback);
        }
    };

    const off = (event: string, callback?: (data: any) => void) => {
        if (socketRef.current) {
            console.log(`🚫 useSocket: Removing listener for ${event}`);
            socketRef.current.off(event, callback);
        }
    };

    return {
        socket: socketRef.current,
        joinAuction,
        leaveAuction,
        onNewBid,
        onAuctionStart,
        onAuctionEnd,
        onBidWinner,
        off,
        isConnected
    };
};