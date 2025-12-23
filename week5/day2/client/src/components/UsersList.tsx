import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/utils/api';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  bio: string;
  followersCount: number;
  isFollowing: boolean;
}

export const UsersList = () => {
  const { user: currentUser, refreshUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await apiService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      await apiService.followUser(userId);
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: true, followersCount: user.followersCount + 1 }
          : user
      ));
      // Refresh current user's follower count
      await refreshUser();
      toast.success('User followed successfully');
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await apiService.unfollowUser(userId);
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: false, followersCount: user.followersCount - 1 }
          : user
      ));
      // Refresh current user's follower count
      await refreshUser();
      toast.success('User unfollowed successfully');
    } catch (error) {
      toast.error('Failed to unfollow user');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Users to Follow</h3>
      
      {users.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No users found</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{user.username}</h4>
                  <p className="text-gray-400 text-sm">{user.bio || 'No bio available'}</p>
                  <p className="text-gray-500 text-xs">{user.followersCount} followers</p>
                </div>
              </div>
              
              <button
                onClick={() => user.isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  user.isFollowing
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {user.isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};