"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Toaster, toast } from "sonner";

// Define the Comment type that matches what backend sends
type Comment = {
  userId: string;
  text: string;
  date: string;
};

// Generate or retrieve persistent user ID
const getUserId = () => {
  if (typeof window !== 'undefined') {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = `User${Math.random().toString(36).substr(2, 8)}`;
      localStorage.setItem('userId', userId);
    }
    return userId;
  }
  return null;
};

export default function Home() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    setMounted(true);
    const id = getUserId();
    setUserId(id);
  }, []);

  useEffect(() => {
  if (!userId) return; // wait until userId is set

  // Prevent multiple socket instances
  if (!socketRef.current) {
    // Initialize socket
    socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      query: { username: userId },
      transports: ['websocket', 'polling'],
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    const socket = socketRef.current;

    // On successful connection
    socket.on("connect", () => {
      setIsConnected(true);
      toast.success("Connected to server", { duration: 2000 });

      // Fetch initial comments
      socket.emit("get_comments", null, (data: Comment[]) => {
        setComments(data || []);
        setIsLoading(false);
      });
    });

    // On disconnect
    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      toast.error(`Disconnected: ${reason}`, { duration: 2000 });

      // If server forcibly disconnected, attempt manual reconnect
      if (reason === "io server disconnect") {
        setTimeout(() => {
          socket.connect();
        }, 2000);
      }
    });

    // On connection error
    socket.on("connect_error", (error) => {
      setIsConnected(false);
      toast.error("Connection failed", { duration: 2000 });
      console.error("Socket connection error:", error);
    });

    // Listen for new comments
    socket.on("new_comment", (newComment: Comment) => {
      setComments((prev) => [newComment, ...prev]);
      if (newComment.userId !== userId) {
        toast.success("New comment received!", {
          duration: 2000,
          description: `From ${newComment.userId}`,
        });
      }
    });
  }

  // Cleanup on component unmount
  return () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };
}, [userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && isConnected && socketRef.current) {
      socketRef.current.emit("add_comment", comment);
      setComment("");
      toast.success("Comment sent!", { duration: 1500 });
    } else if (!isConnected) {
      toast.error("Not connected to server", { duration: 2000 });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen py-4 px-4 sm:py-8 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <Toaster 
        richColors 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f5f5f5',
            border: '1px solid #404040',
          }
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-100 via-white to-gray-300 bg-clip-text text-transparent">
              Real-Time Comments
            </h1>
            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
          </div>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Share your thoughts in real-time with others around the world
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Status: <span className={`font-semibold ${
              isConnected ? 'text-green-400' : 'text-red-400'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span> | User: <span className="text-blue-400 font-mono">{userId || 'Loading...'}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl p-6 sm:p-8 animate-fade-in">
          {/* Comment Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={1000}
                  placeholder="What's on your mind? Share your thoughts..."
                  rows={3}
                  className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl px-4 py-3 text-gray-100 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                           transition-all duration-300 resize-none text-sm sm:text-base"
                />
                <div className="flex justify-between items-center mt-2 px-2">
                  <span className="text-gray-500 text-xs">
                    {comment.length}/1000 characters
                  </span>
                  <span className="text-gray-500 text-xs">
                    {comments.length} comments
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={!comment.trim() || !isConnected}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 
                         disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed
                         text-white px-6 py-3 rounded-2xl font-semibold shadow-lg 
                         transition-all duration-300 transform hover:scale-105 active:scale-95
                         flex items-center justify-center gap-2 min-w-[120px] h-fit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal-icon lucide-send-horizontal"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg>
                Send
              </button>
            </div>
          </form>

          {/* Comments Section */}
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

            {/* Comments List */}
            <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
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
                comments.map((c, i) => (
                  <div
                    key={i}
                    className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-2 m-2 sm:p-5 
                             hover:bg-gray-800/60 transition-all duration-300 animate-slide-in
                             hover:transform hover:scale-[1.02] hover:shadow-lg hover:border-gray-600"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {c.userId.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className={`font-semibold text-sm sm:text-base ${
                            c.userId === userId ? 'text-blue-400' : 'text-gray-200'
                          }`}>
                            {c.userId} {c.userId === userId ? '(You)' : ''}
                          </span>
                          <div className="text-gray-500 text-xs sm:text-sm">
                            {formatDate(c.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed break-words text-sm sm:text-base pl-0 sm:pl-13">
                      {c.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Built with Next.js, Socket.IO, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
