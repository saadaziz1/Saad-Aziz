import { useEffect } from 'react';
import { useSocket } from './useSocket';
import useNotificationStore from '../store/notificationStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from './useToast';
import useAuthStore from '../store/authStore';

export const useNotifications = () => {
  const { socket, isConnected } = useSocket();
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!socket || !isConnected || !user) {
      console.log('Waiting for socket connection...', { socket: !!socket, isConnected, user: !!user });
      return;
    }

    console.log('Setting up notification listeners - socket connected');

    const handleNewReview = (data) => {
      console.log('✅ New review received:', data);
      const reviewData = data._doc || data;
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      
      if (data.excludeUserId === user?.id || reviewData.userId?._id === user?.id) {
        console.log('Skipping notification for current user');
        return;
      }
      
      // If user is mentioned, they will get a specific mention notification
      if (reviewData.mentions && reviewData.mentions.includes(user?.id)) {
        console.log('Skipping generic notification because user is mentioned');
        return;
      }
      
      addNotification({
        type: 'new-review',
        title: 'New Review',
        message: `${reviewData.userId?.name || 'Someone'} added a new review`,
        data: reviewData,
      });
      
      toast({
        title: 'New Review',
        description: `${reviewData.userId?.name || 'Someone'} just reviewed a product!`,
        variant: 'default',
      });
    };

    const handleReviewReply = (data) => {
      console.log('✅ Review reply received:', data);
      addNotification({
        type: 'review-reply',
        title: 'New Reply',
        message: `Someone replied to your review`,
        data,
      });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: 'New Reply',
        description: 'Someone replied to your review!',
        variant: 'default',
      });
    };

    const handleReviewLike = (data) => {
      console.log('✅ Review like received:', data);
      addNotification({
        type: 'review-like',
        title: 'Review Liked',
        message: `Someone liked your review`,
        data,
      });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    };

    const handleReviewMention = (data) => {
      console.log('✅ Review mention received:', data);
      addNotification({
        type: 'review-mention',
        title: 'You were mentioned',
        message: `You were mentioned in a review`,
        data,
      });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: 'You were mentioned',
        description: 'Someone mentioned you in a review!',
        variant: 'default',
      });
    };

    const handleReplyMention = (data) => {
      console.log('✅ Reply mention received:', data);
      addNotification({
        type: 'reply-mention',
        title: 'You were mentioned',
        message: `You were mentioned in a reply`,
        data,
      });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: 'You were mentioned',
        description: 'Someone mentioned you in a reply!',
        variant: 'default',
      });
    };

    const handleReviewUpdate = (data) => {
      console.log('✅ Review update received:', data);
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    };

    socket.on('newReview', handleNewReview);
    socket.on('reviewUpdate', handleReviewUpdate);
    socket.on('reviewReply', handleReviewReply);
    socket.on('reviewLike', handleReviewLike);
    socket.on('reviewMention', handleReviewMention);
    socket.on('replyMention', handleReplyMention);

    console.log('Event listeners attached');

    return () => {
      console.log('Cleaning up event listeners');
      socket.off('newReview', handleNewReview);
      socket.off('reviewUpdate', handleReviewUpdate);
      socket.off('reviewReply', handleReviewReply);
      socket.off('reviewLike', handleReviewLike);
      socket.off('reviewMention', handleReviewMention);
      socket.off('replyMention', handleReplyMention);
    };
  }, [socket, isConnected, addNotification, queryClient, user]);

  return socket;
};