import { Comment } from '@/types';
import { formatDate } from '@/utils';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { CommentForm } from './CommentForm';
import { Avatar } from './Avatar';
import { useState } from 'react';

interface CommentItemProps {
  comment: Comment;
  index: number;
  isReply?: boolean;
}

export const CommentItem = ({ comment, index, isReply = false }: CommentItemProps) => {
  const { user } = useAuth();
  const { likeComment } = useSocket();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleLike = () => {
    likeComment(comment._id);
  };

  const handleReply = () => {
    setShowReplyForm(true);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
  };

  const isLiked = comment.likes?.includes(user?.id || '') || false;

  return (
    <div
      className="bg-gray-900/60 border border-gray-700 rounded-2xl p-3 sm:p-4 md:p-5 
               hover:bg-gray-800/60 transition-colors duration-300 animate-slide-in
               hover:shadow-lg hover:border-gray-600"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Avatar 
            src={comment.author?.profilePicture} 
            username={comment.author?.username || 'U'} 
            size="md" 
            className="flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className={`font-semibold text-xs sm:text-sm md:text-base truncate block ${
              comment.author?._id === user?.id ? 'text-blue-400' : 'text-gray-200'
            }`}>
              {comment.author?.username || 'Unknown'} {comment.author?._id === user?.id ? '(You)' : ''}
            </span>
            <div className="text-gray-500 text-xs">
              {formatDate(comment.createdAt)}
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-300 leading-relaxed break-words text-sm sm:text-base mb-3 sm:mb-4">
        {comment.content}
      </p>
      
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-lg transition-colors text-xs sm:text-sm ${
            isLiked 
              ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' 
              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{comment.likesCount || 0}</span>
        </button>
        
        {!isReply && (
          <button
            onClick={handleReply}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-700 transition-colors text-xs sm:text-sm"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="hidden sm:inline">Reply</span>
          </button>
        )}
        
        {(comment.replies?.length || 0) > 0 && (
          <span className="text-gray-500 text-xs sm:text-sm">
            {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </span>
        )}
      </div>
      
      {/* Reply Form */}
      {showReplyForm && !isReply && (
        <div className="mt-3 sm:mt-4 pl-2 sm:pl-4 border-l-2 border-gray-600">
          <CommentForm replyTo={comment._id} onCancelReply={handleCancelReply} />
        </div>
      )}
      
      {/* Replies */}
      {(comment.replies?.length || 0) > 0 && !isReply && (
        <div className="mt-3 sm:mt-4 ml-2 sm:ml-4 space-y-2 sm:space-y-3 border-l-2 border-gray-700 pl-2 sm:pl-4">
          {comment.replies?.map((reply, replyIndex) => (
            <CommentItem 
              key={`reply-${reply._id}-${replyIndex}`}
              comment={reply} 
              index={replyIndex}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};