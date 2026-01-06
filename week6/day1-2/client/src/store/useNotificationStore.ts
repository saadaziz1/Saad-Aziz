import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'sale';
    date: number;
    read: boolean;
}

interface NotificationState {
    notifications: Notification[];
    addNotification: (message: string, type?: Notification['type']) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
    unreadCount: number;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,
            addNotification: (message, type = 'info') => {
                const id = Math.random().toString(36).substring(7);
                const newNotification: Notification = {
                    id,
                    message,
                    type,
                    date: Date.now(),
                    read: false,
                };
                set((state) => ({
                    notifications: [newNotification, ...state.notifications],
                    unreadCount: state.unreadCount + 1,
                }));
            },
            markAsRead: (id) =>
                set((state) => {
                    const newNotifications = state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    );
                    const newUnreadCount = newNotifications.filter(n => !n.read).length;
                    return { notifications: newNotifications, unreadCount: newUnreadCount };
                }),
            markAllAsRead: () =>
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                    unreadCount: 0,
                })),
            clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
        }),
        {
            name: 'notification-storage',
        }
    )
);
