"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { Comment, SocketState, Notification } from '@/types';
import { useAuth } from './AuthContext';
import { apiService } from '@/utils/api';

interface SocketContextType extends SocketState {
  socket: Socket | null;
  sendComment: (content: string, parentComment?: string) => void;
  likeComment: (commentId: string) => void;
  comments: Comment[];
  notifications: Notification[];
  unreadCount: number;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const lastNotificationRef = useRef<string | null>(null);

  // Initialize socket connection immediately
  useEffect(() => {
    if (socketRef.current) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      loadInitialData();
      
      // Test toast to verify toaster is working
      toast.success('Connected to server!', {
        description: 'Real-time notifications are now active',
        duration: 3000,
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('comment_created', (comment: Comment) => {
      setComments(prev => [comment, ...prev]);
    });

    socket.on('reply_created', (reply: Comment) => {
      setComments(prev => prev.map(comment => {
        if (comment._id === reply.parentComment) {
          return { ...comment, replies: [reply, ...(comment.replies || [])] };
        }
        return comment;
      }));
    });

    socket.on('comment_liked', (data: { commentId: string; liked: boolean; likesCount: number }) => {
      setComments(prev => prev.map(comment => {
        if (comment._id === data.commentId) {
          return { ...comment, likesCount: data.likesCount };
        }
        const updatedReplies = (comment.replies || []).map(reply => 
          reply._id === data.commentId 
            ? { ...reply, likesCount: data.likesCount }
            : reply
        );
        return { ...comment, replies: updatedReplies };
      }));
    });

    socket.on('notification', (notification: Notification) => {
      console.log('Received notification:', notification);
      
      // Always add notification to state
      setNotifications(prev => {
        if (prev.some(n => n._id === notification._id)) {
          return prev;
        }
        return [notification, ...prev];
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Join room when user changes
  useEffect(() => {
    if (user && socketRef.current?.connected) {
      socketRef.current.emit('join', { userId: user.id });
    }
  }, [user]);

  // Handle notifications when they arrive
  useEffect(() => {
    if (!user || notifications.length === 0) return;

    const latestNotification = notifications[0];
    
    // Check if this notification is for the current user and is new
    if (latestNotification.recipient === user.id && 
        !latestNotification.read &&
        latestNotification._id !== lastNotificationRef.current) {
      
      lastNotificationRef.current = latestNotification._id;
      
      console.log('Showing toast for notification:', latestNotification);
      
      // Update unread count
      const userNotifications = notifications.filter(n => n.recipient === user.id);
      const unread = userNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      
      // Show toast
      const notificationTitle = getNotificationTitle(latestNotification.type);
      toast.info(notificationTitle, {
        description: latestNotification.message,
        duration: 5000,
      });
    }
  }, [notifications, user]);

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'new_comment': return '💬 New Comment';
      case 'comment_reply': return '↩️ New Reply';
      case 'comment_like': return '❤️ Comment Liked';
      default: return '🔔 Notification';
    }
  };

  const loadInitialData = async () => {
    try {
      const [commentsData, notificationsData] = await Promise.all([
        apiService.getComments(),
        apiService.getNotifications()
      ]);
      
      setComments(commentsData);
      setNotifications(notificationsData);
      
      // Count unread notifications for current user
      if (user) {
        const unread = notificationsData.filter((n: Notification) => 
          !n.read && n.recipient === user.id
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      setComments([]);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const sendComment = (content: string, parentComment?: string) => {
    if (!socketRef.current || !user) return;
    
    // Test toast to verify toaster is working
    toast.success('Sending comment...', {
      description: 'Your comment is being posted',
      duration: 2000,
    });
    
    socketRef.current.emit('new_comment', {
      content,
      parentComment,
      userId: user.id
    });
  };

  const likeComment = (commentId: string) => {
    if (!socketRef.current || !user) return;
    
    socketRef.current.emit('like_comment', {
      commentId,
      userId: user.id
    });
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await apiService.markAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      
      // Update unread count
      if (user) {
        const userNotifications = notifications.filter(n => n.recipient === user.id);
        const unread = userNotifications.filter(n => !n.read && n._id !== notificationId).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      // Fallback to local state update
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await apiService.markAllAsRead();
      setNotifications(prev => prev.map(n => 
        n.recipient === user?.id ? { ...n, read: true } : n
      ));
      setUnreadCount(0);
    } catch (error) {
      // Fallback to local state update
      setNotifications(prev => prev.map(n => 
        n.recipient === user?.id ? { ...n, read: true } : n
      ));
      setUnreadCount(0);
    }
  };

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      isConnected,
      isLoading,
      sendComment,
      likeComment,
      comments,
      notifications,
      unreadCount,
      markNotificationAsRead,
      markAllNotificationsAsRead
    }}>
      {children}
    </SocketContext.Provider>
  );
};