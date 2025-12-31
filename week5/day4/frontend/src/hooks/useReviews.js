import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsAPI } from '../api/reviews';
import { toast } from './useToast';

export const useProductReviews = (productId) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewsAPI.getProductReviews(productId),
    select: (data) => data.data,
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsAPI.createReview,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: 'Review Added',
        description: 'Your review has been posted successfully.',
        variant: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to post review. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useReplyToReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, ...data }) => reviewsAPI.replyToReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: 'Reply Added',
        description: 'Your reply has been posted successfully.',
        variant: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to post reply. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useLikeReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsAPI.likeReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to like review. Please try again.',
        variant: 'destructive',
      });
    },
  });
};