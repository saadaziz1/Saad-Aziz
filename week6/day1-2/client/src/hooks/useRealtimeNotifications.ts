import { useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useNotificationStore } from '../store/useNotificationStore';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-hot-toast';

export const useRealtimeNotifications = () => {
    const socket = useSocket();
    const addNotification = useNotificationStore((state) => state.addNotification);
    const { user } = useAuthStore();

    useEffect(() => {
        if (socket) {
            socket.on('sale_started', (data) => {
                // Filter out admins/super admins from receiving sale notifications
                if (user?.role && ['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
                    return;
                }
                addNotification(data.message, 'sale');
                toast.success(data.message, { icon: '🔥' });
            });

            socket.on('order_status_updated', (data) => {
                addNotification(`Your order #${data.orderId} is now ${data.status.toLowerCase()}!`, 'info');
                toast.success(`Order #${data.orderId} updated to ${data.status.toLowerCase()}`);
            });

            return () => {
                socket.off('sale_started');
                socket.off('order_status_updated');
            };
        }
    }, [socket, addNotification, user]);
};
