import { CommentItem } from './CommentItem';
import { useSocket } from '@/context/SocketContext';

export const CommentsList = () => {
  const { comments, isLoading } = useSocket();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-100">
          Recent Comments
        </h2>
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-4 h-4 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
            Loading...
          </div>
        )}
      </div>

      <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2 m-4">
        {comments.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">No comments yet</p>
            <p className="text-gray-600 text-sm mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};