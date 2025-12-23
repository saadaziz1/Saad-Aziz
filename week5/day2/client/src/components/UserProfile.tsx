import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/utils/api';
import { User } from '@/types';
import { Avatar } from './Avatar';
import { toast } from 'sonner';

interface UserProfileProps {
  userId?: string;
  onClose?: () => void;
}

export const UserProfile = ({ userId, onClose }: UserProfileProps) => {
  const { user: currentUser, refreshUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const userData = isOwnProfile 
        ? await apiService.getProfile()
        : await apiService.getProfileById(userId!);
      setProfileUser(userData);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profileUser || isOwnProfile) return;
    
    setIsFollowLoading(true);
    try {
      if (profileUser.isFollowing) {
        await apiService.unfollowUser(profileUser.id);
        setProfileUser(prev => prev ? {
          ...prev,
          isFollowing: false,
          followersCount: prev.followersCount - 1
        } : null);
        toast.success(`Unfollowed ${profileUser.username}`);
      } else {
        await apiService.followUser(profileUser.id);
        setProfileUser(prev => prev ? {
          ...prev,
          isFollowing: true,
          followersCount: prev.followersCount + 1
        } : null);
        toast.success(`Following ${profileUser.username}`);
      }
      await refreshUser();
    } catch (error) {
      toast.error('Failed to update follow status');
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center p-8 text-gray-400">
        Profile not found
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-3xl p-8 max-w-sm mx-auto shadow-2xl backdrop-blur-sm">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      <div className="text-center">
        <div className="relative mb-6">
          <Avatar 
            src={profileUser.profilePicture} 
            username={profileUser.username} 
            size="xl" 
            className="mx-auto border-4 border-blue-500/20 shadow-lg" 
          />
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-gray-800"></div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">{profileUser.username}</h2>
        <p className="text-blue-400 mb-4 font-medium">{profileUser.email}</p>
        
        {profileUser.bio && (
          <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 border border-gray-700">
            <p className="text-gray-300 text-sm leading-relaxed">{profileUser.bio}</p>
          </div>
        )}
        
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{profileUser.followersCount}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Followers</div>
          </div>
          {profileUser.followingCount !== undefined && (
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{profileUser.followingCount}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Following</div>
            </div>
          )}
        </div>
        
        {!isOwnProfile && (
          <button
            onClick={handleFollow}
            disabled={isFollowLoading}
            className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-200 ${
              profileUser.isFollowing
                ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isFollowLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : profileUser.isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
    </div>
  );
};