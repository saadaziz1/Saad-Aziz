import { useState } from 'react';
import { useSocket } from '@/context/SocketContext';

export const useCommentForm = () => {
  const [comment, setComment] = useState('');
  const { sendComment, isConnected } = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      sendComment(comment);
      setComment('');
    }
  };

  return {
    comment,
    setComment,
    handleSubmit,
    isConnected
  };
};