import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductReviews, useCreateReview, useReplyToReview, useLikeReview } from '../../hooks/useReviews';
import useAuthStore from '../../store/authStore';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Heart, MessageCircle, Send, Star } from 'lucide-react';
import Editor from '../ui/Editor';
import { extractMentionIdsFromHTML, extractPlainTextFromHTML } from '../../utils/mentionUtils';

const Reviews = ({ productId }) => {
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [replyText, setReplyText] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const navigate = useNavigate();

  const { data: reviews, isLoading } = useProductReviews(productId);
  const createReviewMutation = useCreateReview();
  const replyMutation = useReplyToReview();
  const likeMutation = useLikeReview();
  const { user, isAuthenticated } = useAuthStore();

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const plainText = extractPlainTextFromHTML(newReview);
    if (!plainText.trim() || !newRating) return;

    // Extract mention IDs from HTML content
    const mentions = extractMentionIdsFromHTML(newReview);
    
    await createReviewMutation.mutateAsync({
      productId,
      content: newReview,
      plainText: plainText,
      mentions: mentions,
      rating: newRating,
    });
    setNewReview('');
    setNewRating(0);
  };

  const handleReply = async (reviewId) => {
    const content = replyText[reviewId];
    if (!content || !isAuthenticated()) return;

    const plainText = extractPlainTextFromHTML(content);
    if (!plainText.trim()) return;

    // Extract mention IDs from HTML content
    const mentions = extractMentionIdsFromHTML(content);

    await replyMutation.mutateAsync({
      reviewId,
      content,
      plainText: plainText,
      mentions: mentions,
    });
    setReplyText({ ...replyText, [reviewId]: '' });
    setShowReplyForm({ ...showReplyForm, [reviewId]: false });
  };

  const handleLike = async (reviewId) => {
    if (!isAuthenticated()) return;
    await likeMutation.mutateAsync(reviewId);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Reviews</h3>
      
      {/* Add Review Form - Always show */}
      <Card className="p-4 mb-6">
        <form onSubmit={handleSubmitReview}>
          <div className="mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <span className="text-sm font-medium">Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= newRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Editor
              content={newReview}
              onChange={setNewReview}
              placeholder={isAuthenticated() ? "Write your review... (Type @ to mention users)" : "Write your review... (Login required)"}
              className="flex-1 w-full"
              disabled={!isAuthenticated()}
            />
            <Button 
              type="submit" 
              disabled={!extractPlainTextFromHTML(newReview).trim() || !newRating || createReviewMutation.isPending}
              className="w-full sm:w-auto self-end"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Review
            </Button>
          </div>
        </form>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews?.map((review) => (
            <Card key={review._id} className="p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="font-medium">
                    {review.userId?.name || 'Anonymous User'}
                    {(review.userId?.role === 'admin' || review.userId?.role === 'superadmin') && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {review.userId.role}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div 
                className="mb-3 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: review.content }}
              />
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(review._id)}
                  className="flex items-center gap-1"
                >
                  <Heart className={`w-4 h-4 ${review.likes?.includes(user?.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="text-sm">{review.likes?.length || 0}</span>
                </Button>
                
                {isAuthenticated() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyForm({ 
                      ...showReplyForm, 
                      [review._id]: !showReplyForm[review._id] 
                    })}
                    className="flex items-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Reply</span>
                  </Button>
                )}
              </div>

              {/* Reply Form */}
              {showReplyForm[review._id] && (
                <div className="flex flex-col gap-2 mb-3">
                  <Editor
                    content={replyText[review._id] || ''}
                    onChange={(content) => setReplyText({ 
                      ...replyText, 
                      [review._id]: content 
                    })}
                    placeholder="Write a reply... (Type @ to mention users)"
                    className="flex-1"
                  />
                  <Button 
                    size="sm"
                    onClick={() => handleReply(review._id)}
                    disabled={!extractPlainTextFromHTML(replyText[review._id] || '').trim() || replyMutation.isPending}
                    className="w-full sm:w-auto self-end"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              )}

              {/* Replies */}
              {review.replies?.length > 0 && (
                <div className="ml-6 space-y-2 border-l-2 border-gray-100 pl-4">
                  {review.replies.map((reply, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-black p-3 rounded">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-sm">
                          {reply.userId?.name || 'Anonymous User'}
                          {(reply.userId?.role === 'admin' || reply.userId?.role === 'superadmin') && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                              {reply.userId.role}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div 
                        className="text-sm prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: reply.content }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;