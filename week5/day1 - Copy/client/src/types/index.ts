export interface User {
  id: string;
  username: string;
  email: string;
  bio: string;
  profilePicture: string;
  followersCount: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export interface Comment {
  _id: string;
  author: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  content: string;
  parentComment?: string;
  replies: Comment[];
  likes: string[];
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  type: 'new_comment' | 'comment_reply' | 'comment_like' | 'new_follower';
  message: string;
  comment?: {
    _id: string;
    content: string;
  };
  read: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SocketState {
  isConnected: boolean;
  isLoading: boolean;
}