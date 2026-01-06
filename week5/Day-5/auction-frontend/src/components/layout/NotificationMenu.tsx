"use client";

import { useAuthStore } from "@/stores/authStore";
import { useNotifications, useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useDeleteNotification } from "@/hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { clsx } from "clsx";

import { useSocketContext } from "@/providers/SocketProvider";

export function NotificationMenu() {
  const user = useAuthStore((s) => s.user);
  const { isConnected } = useSocketContext();

  // Only fetch if authenticated AND socket is initialized 
  const effectiveUserId = user?.id || user?._id;
  const { data: notifications = [] } = useNotifications(
    (effectiveUserId && isConnected) ? effectiveUserId : ""
  );

  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  // Sort: unread first, then by date desc
  const sortedNotifications = [...notifications].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    if (a.isRead === b.isRead) {
      return timeB - timeA;
    }
    return a.isRead ? 1 : -1;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.preventDefault();
    if (effectiveUserId) {
      markAllAsRead(effectiveUserId);
    }
  };

  const handleNotificationClick = (id: string, isRead?: boolean) => {
    if (!isRead) {
      markAsRead(id);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent marking as read if it was unread
    deleteNotification(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors outline-none ring-0 focus:ring-0">
          <Bell className="w-6 h-6 text-[#2E3D83]" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-2">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-[#2E3D83] border border-[#2E3D83] rounded-sm px-2"
            >
              Mark all as read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[350px]">
          {sortedNotifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No notifications yet
            </div>
          ) : (
            sortedNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification._id}
                className={clsx(
                  "flex flex-col items-start gap-1 p-3 cursor-pointer outline-none transition-colors relative group",
                  !notification.isRead ? "bg-[#E8F2FF] border-l-4 border-[#2E3D83] focus:bg-[#D9EAFF]" : "focus:bg-gray-50 border-l-4 border-transparent"
                )}
                onClick={() => handleNotificationClick(notification._id, notification.isRead)}
              >
                <div className="flex w-full items-start justify-between gap-2 pr-4">
                  <span className={clsx(
                    "text-sm line-clamp-2",
                    !notification.isRead ? "font-semibold text-gray-900" : "font-normal text-gray-600"
                  )}>
                    {notification.message}
                  </span>
                  {!notification.isRead && (
                    <span className="h-2 w-2 mt-1.5 shrink-0 rounded-full bg-blue-600" />
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : 'Just now'}
                </span>

                {/* Delete Button - only visible on hover */}
                <button
                  onClick={(e) => handleDelete(e, notification._id)}
                  className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
