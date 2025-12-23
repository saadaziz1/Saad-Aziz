import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/utils';
import { Avatar } from './Avatar';
import { useEffect, useState } from 'react';

export const NotificationPanel = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useSocket();
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh when notifications change
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [notifications]);

  // Filter notifications for current user and calculate unread count
  const userNotifications = notifications.filter(n => n.recipient === user?.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <div key={refreshKey} className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          Notifications ({unreadCount})
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Mark all read
          </button>
        )}
      </div>
      
      {userNotifications.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No notifications yet</p>
      ) : (
        <div className="space-y-2">
          {userNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                notification.read 
                  ? 'bg-gray-800/50 text-gray-300' 
                  : 'bg-blue-900/30 text-white border border-blue-700/50'
              }`}
              onClick={() => {
                if (!notification.read) {
                  markNotificationAsRead(notification._id);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar 
                    src={notification.sender?.profilePicture} 
                    username={notification.sender?.username || 'U'} 
                    size="md" 
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-blue-400 font-semibold text-sm">
                        {notification.sender?.username || 'Unknown User'}
                      </span>
                    </div>
                    <p className="text-sm">{notification.message}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 ml-2">
                  {formatDate(notification.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};