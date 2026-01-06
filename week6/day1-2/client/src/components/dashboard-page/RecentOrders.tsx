import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { MoreVertical, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const RecentOrders = () => {
    const { recentOrders, isLoadingOrders } = useDashboard();
    const router = useRouter();

    if (isLoadingOrders) {
        return (
            <div className="bg-white p-6 rounded-xl border border-gray-100 mt-6 shadow-sm">
                <h2 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Recent Orders</h2>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded mb-2"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 mt-6 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6 px-1">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Orders</h2>
                <button className="text-gray-400">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No recent orders</p>
                </div>
            ) : (
                <div className="overflow-x-auto -mx-6">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F9FB] border-y border-gray-100">
                            <tr>
                                <th className="py-4 px-6 font-semibold text-gray-500 text-[11px] w-12">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </th>
                                <th className="py-4 px-4 font-semibold text-gray-500 text-[11px] uppercase">Product</th>
                                <th className="py-4 px-4 font-semibold text-gray-500 text-[11px] uppercase">Order ID</th>
                                <th className="py-4 px-4 font-semibold text-gray-500 text-[11px] uppercase">Date</th>
                                <th className="py-4 px-4 font-semibold text-gray-500 text-[11px] uppercase">Customer Name</th>
                                <th className="py-4 px-4 font-semibold text-gray-500 text-[11px] uppercase">Status</th>
                                <th className="py-4 px-4 font-semibold text-gray-500 text-[11px] uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentOrders.map((order: any, index: number) => {
                                const firstItem = order.items?.[0];
                                const productName = firstItem?.productId?.name || 'Unknown Product';
                                const customerName = order.userId?.name || order.shippingAddress?.firstName || 'Guest';
                                const date = new Date(order.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                });

                                return (
                                    <tr
                                        key={order._id || index}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/dashboard/orders/${order._id}`)}
                                    >
                                        <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-gray-900 text-sm font-medium">{productName}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-gray-500 text-sm">#{(order._id || '').slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-gray-500 text-sm">{date}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                                    {order.userId?.avatar ? (
                                                        <img src={order.userId.avatar} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-gray-600 text-[10px] font-bold">
                                                            {customerName.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-900 text-sm">{customerName}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center">
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${order.status === 'DELIVERED' ? 'bg-blue-500' :
                                                        order.status === 'CANCELLED' ? 'bg-orange-400' :
                                                            'bg-yellow-400'
                                                    }`} />
                                                <span className={`text-xs font-medium ${order.status === 'DELIVERED' ? 'text-blue-500' :
                                                        order.status === 'CANCELLED' ? 'text-orange-400' :
                                                            'text-yellow-600'
                                                    }`}>
                                                    {order.status === 'DELIVERED' ? 'Delivered' :
                                                        order.status === 'CANCELLED' ? 'Canceled' :
                                                            'Processing'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-bold text-gray-900 text-sm">₹{(order.totalAmount || 0).toLocaleString()}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};