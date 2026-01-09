import React, { useState } from 'react';
import { useUpdateOrderStatusMutation } from '@/api/ordersApi';
import toast from 'react-hot-toast';

interface RefundButtonProps {
    orderId: string;
    currentStatus: string;
}

export const RefundButton: React.FC<RefundButtonProps> = ({ orderId, currentStatus }) => {
    const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();
    const [showConfirm, setShowConfirm] = useState(false);

    // Only allow refund/cancel if order is PAID or PROCESSING (not already cancelled/failed)
    // Adjust logic as suitable for your workflow. 
    // Usually refunds are for PAID orders.
    if (currentStatus === 'CANCELLED' || currentStatus === 'FAILED' || currentStatus === 'PENDING') {
        return null;
    }

    const handleRefund = async () => {
        try {
            await updateStatus({ id: orderId, status: 'CANCELLED' }).unwrap();
            toast.success('Order refunded and cancelled successfully');
            setShowConfirm(false);
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to refund order');
        }
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-red-600 font-medium">Are you sure? This will refund points/money.</span>
                <button
                    onClick={handleRefund}
                    disabled={isLoading}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : 'Yes, Refund'}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isLoading}
                    className="bg-gray-200 text-black px-3 py-1 rounded text-sm hover:bg-gray-300"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="bg-gray-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-colors"
        >
            Refund Order
        </button>
    );
};
