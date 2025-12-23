import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/utils/api';
import { User } from '@/types';
import { UserProfile } from './UserProfile';
import { Avatar } from './Avatar';
import { toast } from 'sonner';

export const UserList = () => {
  const { user: currentUser, refreshUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const userData = await apiService.getAllUsers();
      setUsers(userData);
      
      const initialStates: Record<string, boolean> = {};
      userData.forEach((user: User) => {
        initialStates[user.id] = false;
      });
      setFollowingStates(initialStates);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId: string, isFollowing: boolean) => {
    setFollowingStates(prev => ({ ...prev, [userId]: true }));
    
    try {
      if (isFollowing) {
        await apiService.unfollowUser(userId);
        setUsers(prev => prev.map((user: User) => 
          user.id === userId 
            ? { ...user, isFollowing: false, followersCount: user.followersCount - 1 }
            : user
        ));
      } else {
        await apiService.followUser(userId);
        setUsers(prev => prev.map((user: User) => 
          user.id === userId 
            ? { ...user, isFollowing: true, followersCount: user.followersCount + 1 }
            : user
        ));
      }
      await refreshUser();
    } catch (error) {
      toast.error('Failed to update follow status');
    } finally {
      setFollowingStates(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Discover Users</h2>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
              <div 
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => setSelectedUser(user.id)}
              >
                <Avatar 
                  src={user.profilePicture} 
                  username={user.username} 
                  size="lg" 
                />
                
                <div className="flex-1">
                  <div className="font-semibold text-white">{user.username}</div>
                  {user.bio && (
                    <div className="text-sm text-gray-400 truncate">{user.bio}</div>
                  )}
                  <div className="text-xs text-gray-500">{user.followersCount} followers</div>
                </div>
              </div>
              
              <button
                onClick={() => handleFollow(user.id, user.isFollowing || false)}
                disabled={followingStates[user.id]}
                className={`px-4 py-1 rounded-lg text-sm font-semibold transition-colors ${
                  user.isFollowing
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50`}
              >
                {followingStates[user.id] ? '...' : user.isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          ))}
          
          {users.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No users found
            </div>
          )}
        </div>
      </div>
      
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <UserProfile 
            userId={selectedUser} 
            onClose={() => setSelectedUser(null)} 
          />
        </div>
      )}
    </>
  );
};