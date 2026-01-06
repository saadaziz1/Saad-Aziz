import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface SocketStore {
    socket: Socket | null;
    connect: () => void;
    disconnect: () => void;
}

const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,
    connect: () => {
        const { socket } = get();
        if (socket) return;

        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
            autoConnect: true,
        });
        set({ socket: newSocket });
    },
    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.close();
            set({ socket: null });
        }
    }
}));

export const useSocket = () => {
    const { socket, connect, disconnect } = useSocketStore();

    useEffect(() => {
        connect();
        // We handle global socket persistence, 
        // usually we don't want to disconnect on every unmount of a hook
        // unless this is the only consumer.
    }, [connect]);

    return socket;
};
