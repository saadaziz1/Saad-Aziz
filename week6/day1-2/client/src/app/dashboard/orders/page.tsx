"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-page/DashboardLayout';
import { useGetOrdersQuery, useBulkUpdateOrderStatusMutation } from '@/api/ordersApi';
import { ChevronRight, Loader2, MoreVertical, Calendar, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function OrdersListPage() {
    const { data: orders = [], isLoading } = useGetOrdersQuery(undefined);
    const [bulkUpdateStatus, { isLoading: isBulkUpdating }] = useBulkUpdateOrderStatusMutation();
    const router = useRouter();

    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'text-blue-500';
            case 'CANCELLED': return 'text-orange-400';
            case 'SHIPPED': return 'text-purple-500';
            default: return 'text-yellow-600';
        }
    };

    const getStatusDotColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'bg-blue-500';
            case 'CANCELLED': return 'bg-orange-400';
            case 'SHIPPED': return 'bg-purple-500';
            default: return 'bg-yellow-400';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'Delivered';
            case 'CANCELLED': return 'Canceled';
            case 'SHIPPED': return 'Shipped';
            case 'PAID': return 'Paid';
            default: return 'Processing';
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedOrderIds(orders.map((o: any) => o._id));
        } else {
            setSelectedOrderIds([]);
        }
    };

    const handleToggleSelect = (id: string) => {
        if (selectedOrderIds.includes(id)) {
            setSelectedOrderIds(prev => prev.filter(oid => oid !== id));
        } else {
            setSelectedOrderIds(prev => [...prev, id]);
        }
    };

    const handleBulkStatusChange = async (status: string) => {
        if (selectedOrderIds.length === 0) {
            toast.error("Please select at least one order");
            return;
        }
        if (status === "Change Status") return;

        try {
            await bulkUpdateStatus({ orderIds: selectedOrderIds, status: status.toUpperCase() }).unwrap();
            toast.success(`Updated ${selectedOrderIds.length} orders to ${status}`);
            setSelectedOrderIds([]);
        } catch (err) {
            toast.error("Failed to update orders");
        }
    };

    const isAllSelected = orders.length > 0 && selectedOrderIds.length === orders.length;

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders List</h1>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                        <span>Home</span>
                        <ChevronRight className="w-3 h-3 mx-1" />
                        <span className="text-gray-600">Orders List</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center text-[10px] font-bold text-gray-500 uppercase">
                        <Calendar className="w-3 h-3 mr-2" />
                        Feb 16, 2023 - Feb 24, 2023
                    </div>
                    <select
                        onChange={(e) => handleBulkStatusChange(e.target.value)}
                        disabled={selectedOrderIds.length === 0 || isBulkUpdating}
                        className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm text-[10px] font-bold text-gray-500 uppercase outline-none focus:ring-1 focus:ring-[#003B5C] disabled:opacity-50"
                    >
                        <option>Change Status</option>
                        <option value="PAID">Paid</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="flex justify-between items-center p-6 border-b border-gray-50">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        {selectedOrderIds.length > 0 ? `${selectedOrderIds.length} Orders Selected` : 'Recent Purchases'}
                    </h2>
                    <button className="text-gray-300">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[#003B5C] animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingCart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No Orders Found</h3>
                        <p className="text-gray-500 text-center max-w-xs">
                            You don't have any orders yet. Once orders are placed, they will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#F8F9FB] border-b border-gray-50">
                                <tr>
                                    <th className="py-4 px-6 font-semibold text-gray-500 text-[11px] w-12">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="py-4 px-4 font-semibold text-gray-500 text-[11px] uppercase">Product</th>
                                    <th className="py-4 px-4 font-semibold text-gray-500 text-[11px] uppercase">Order ID</th>
                                    <th className="py-4 px-4 font-semibold text-gray-500 text-[11px] uppercase">Date</th>
                                    <th className="py-4 px-4 font-semibold text-gray-500 text-[11px] uppercase">Customer Name</th>
                                    <th className="py-4 px-4 font-semibold text-gray-500 text-[11px] uppercase">Status</th>
                                    <th className="py-4 font-semibold text-gray-500 text-[11px] uppercase text-right px-8">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map((order: any) => {
                                    const firstItem = order.items?.[0];
                                    const productName = firstItem?.productId?.name || 'Multiple Products';
                                    const customerName = order.userId?.name || order.shippingAddress?.firstName || 'Guest';
                                    const date = new Date(order.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    });

                                    return (
                                        <tr
                                            key={order._id}
                                            className={cn(
                                                "hover:bg-gray-50 transition-colors cursor-pointer group",
                                                selectedOrderIds.includes(order._id) && "bg-blue-50/30 hover:bg-blue-50/50"
                                            )}
                                            onClick={() => router.push(`/dashboard/orders/${order._id}`)}
                                        >
                                            <td className="py-5 px-6" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300"
                                                    checked={selectedOrderIds.includes(order._id)}
                                                    onChange={() => handleToggleSelect(order._id)}
                                                />
                                            </td>
                                            <td className="py-5 px-4">
                                                <span className="text-gray-900 text-[13px] font-bold truncate max-w-[150px] inline-block">{productName}</span>
                                            </td>
                                            <td className="py-5 px-4">
                                                <span className="text-gray-500 text-[12px] font-medium uppercase tracking-tighter">#{order._id.slice(-6)}</span>
                                            </td>
                                            <td className="py-5 px-4">
                                                <span className="text-gray-500 text-[12px] font-medium">{date}</span>
                                            </td>
                                            <td className="py-5 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-[#F0F2F5] rounded-full flex items-center justify-center overflow-hidden border border-white shadow-sm ring-1 ring-gray-100">
                                                        {order.userId?.avatar ? (
                                                            <img src={order.userId.avatar} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-[#003B5C] text-[10px] font-black">
                                                                {customerName.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-gray-900 text-[13px]">{customerName}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <div className="flex items-center">
                                                    <div className={cn("w-1.5 h-1.5 rounded-full mr-2", getStatusDotColor(order.status))} />
                                                    <span className={cn("text-[11px] font-black uppercase tracking-tight", getStatusColor(order.status))}>
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="font-black text-gray-900 text-[13px]">₹{(order.totalAmount || 0).toLocaleString()}</span>
                                                    {order.pointsUsed > 0 && (
                                                        <span className="text-[10px] font-bold text-violet-500">
                                                            {order.pointsUsed.toLocaleString()} pts
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination Mockup */}
            <div className="flex items-center space-x-2 mt-8">
                <button className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] text-white rounded text-xs font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-500 rounded text-xs font-bold hover:bg-gray-50 transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-500 rounded text-xs font-bold hover:bg-gray-50 transition-colors">3</button>
                <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-500 rounded text-xs font-bold hover:bg-gray-50 transition-colors">4</button>
                <span className="text-gray-400 text-xs px-1">...</span>
                <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-500 rounded text-xs font-bold hover:bg-gray-50 transition-colors">12</button>
                <button className="px-3 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-500 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors ml-2">Next <ChevronRight className="w-3 h-3 ml-1" /></button>
            </div>
        </DashboardLayout>
    );
}
