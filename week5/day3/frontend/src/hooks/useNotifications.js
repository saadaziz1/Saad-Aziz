import { useEffect } from 'react';
import { useSocket } from './useSocket';
import useNotificationStore from '../store/notificationStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from './useToast';
import useAuthStore from '../store/authStore';

export const useNotifications = () => {
  const socket = useSocket();
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!socket) return;

    // Listen for new reviews (broadcast to all users)
    const handleNewReview = (data) => {
      console.log('Received newReview event:', data);
      
      // Always refresh reviews for all users (including author)
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      
      // Skip notification if this is from the current user or if excludeUserId matches
      if (data.excludeUserId === user?.id || data.userId?._id === user?.id) {
        return;
      }
      
      addNotification({
        type: 'new-review',
        title: 'New Review',
        message: `${data.userId?.name || 'Someone'} added a new review`,
        data,
      });
      
      toast({
        title: 'New Review',
        description: `${data.userId?.name || 'Someone'} just reviewed a product!`,
        variant: 'default',
      });
    };

    // Listen for review replies (direct to review owner)
    const handleReviewReply = (data) => {
      addNotification({
        type: 'review-reply',
        title: 'New Reply',
        message: `Someone replied to your review`,
        data,
      });
      
      // Aggressively refresh reviews
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.refetchQueries({ queryKey: ['reviews'] });
      
      toast({
        title: 'New Reply',
        description: 'Someone replied to your review!',
        variant: 'default',
      });
    };

    // Listen for review likes
    const handleReviewLike = (data) => {
      addNotification({
        type: 'review-like',
        title: 'Review Liked',
        message: `Someone liked your review`,
        data,
      });
      
      // Aggressively refresh reviews
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.refetchQueries({ queryKey: ['reviews'] });
    };

    // Listen for review updates (replies and likes)
    const handleReviewUpdate = (data) => {
      console.log('Received reviewUpdate event:', data);
      // Aggressively refresh all review queries
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.refetchQueries({ queryKey: ['reviews'] });
      console.log('Invalidated and refetched reviews queries due to reviewUpdate');
    };

    socket.on('newReview', handleNewReview);
    socket.on('reviewUpdate', handleReviewUpdate);
    socket.on('reviewReply', handleReviewReply);
    socket.on('reviewLike', handleReviewLike);

    return () => {
      socket.off('newReview', handleNewReview);
      socket.off('reviewUpdate', handleReviewUpdate);
      socket.off('reviewReply', handleReviewReply);
      socket.off('reviewLike', handleReviewLike);
    };
  }, [socket, addNotification, queryClient]);

  return socket;
};