import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

const SOCKET_URL = 'http://localhost:3001';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      socketRef.current = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem('token'),
        },
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user]);

  return socketRef.current;
};