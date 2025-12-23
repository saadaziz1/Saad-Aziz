import { useState } from 'react';
import { useSocket } from '@/context/SocketContext';

interface CommentFormProps {
  replyTo?: string;
  onCancelReply?: () => void;
}

export const CommentForm = ({ replyTo, onCancelReply }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const { sendComment, isConnected, comments } = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      sendComment(content, replyTo);
      setContent('');
      if (replyTo && onCancelReply) {
        onCancelReply();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      {replyTo && (
        <div className="mb-2 text-sm text-blue-400">
          Replying to comment... 
          <button 
            type="button" 
            onClick={onCancelReply}
            className="ml-2 text-red-400 hover:text-red-300"
          >
            Cancel
          </button>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
            placeholder="What's on your mind? Share your thoughts..."
            rows={3}
            className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl px-4 py-3 text-gray-100 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                     transition-all duration-300 resize-none text-sm sm:text-base"
          />
          <div className="flex justify-between items-center mt-2 px-2">
            <span className="text-gray-500 text-xs">
              {content.length}/1000 characters
            </span>
            <span className="text-gray-500 text-xs">
              {comments.length} comments
            </span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!content.trim() || !isConnected}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 
                   disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed
                   text-white px-6 py-3 rounded-2xl font-semibold shadow-lg 
                   transition-all duration-300 transform hover:scale-105 active:scale-95
                   flex items-center justify-center gap-2 min-w-[120px] h-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/>
            <path d="M6 12h16"/>
          </svg>
          {replyTo ? 'Reply' : 'Send'}
        </button>
      </div>
    </form>
  );
};