"use client";

import React from 'react';
import { DashboardLayout } from '@/components/dashboard-page/DashboardLayout';
import { RefundButton } from '@/components/dashboard/RefundButton';
import { useGetOrderQuery, useUpdateOrderStatusMutation } from '@/api/ordersApi';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronRight,
    Loader2,
    Calendar,
    Printer,
    Save,
    User,
    ShoppingBag,
    Truck,
    CreditCard,
    FileText,
    MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: order, isLoading } = useGetOrderQuery(id as string);
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    const getStatusText = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'Delivered';
            case 'CANCELLED': return 'Canceled';
            case 'SHIPPED': return 'Shipped';
            case 'PAID': return 'Paid';
            default: return 'Processing';
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            await updateStatus({ id: id as string, status: newStatus }).unwrap();
            toast.success(`Order status updated to ${newStatus}`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[600px]">
                    <Loader2 className="w-12 h-12 text-[#003B5C] animate-spin mb-4" />
                    <p className="text-gray-500 font-medium tracking-wider uppercase text-xs">Fetching Order Details...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!order) {
        return (
            <DashboardLayout>
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Order Not Found</h2>
                    <p className="text-gray-500 mb-8">The order you're looking for doesn't exist or you don't have access.</p>
                    <button
                        onClick={() => router.push('/dashboard/orders')}
                        className="bg-[#003B5C] text-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-md"
                    >
                        Return to Orders
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    const date = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const subtotal = order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;
    const tax = subtotal * 0.18; // Mock 18% tax
    const totalWithTax = subtotal + tax;

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders Details</h1>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                        <span>Home</span>
                        <ChevronRight className="w-3 h-3 mx-1" />
                        <span>Orders List</span>
                        <ChevronRight className="w-3 h-3 mx-1" />
                        <span className="text-gray-600 truncate max-w-[100px]">Order #{order._id.slice(-6).toUpperCase()}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold text-gray-900">Orders ID: #{(order._id || '').slice(-6).toUpperCase()}</h2>
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider">
                            {getStatusText(order.status)}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 text-[10px] font-bold text-gray-500 uppercase">
                            <Calendar className="w-3 h-3 mr-2 text-[#003B5C]" />
                            {date}
                        </div>
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={isUpdating}
                            className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-[10px] font-bold text-gray-700 uppercase outline-none focus:ring-1 focus:ring-[#003B5C] min-w-[150px]"
                        >
                            <option value="PAID">Processing / Paid</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Canceled</option>
                        </select>
                        <button className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-lg border border-gray-100 transition-colors">
                            <Printer className="w-4 h-4" />
                        </button>
                        <RefundButton orderId={order._id} currentStatus={order.status} />
                        <button className="bg-[#003B5C] text-white px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all flex items-center shadow-lg">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {/* Customer Info */}
                    <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-[#F0F2F5] rounded-xl flex items-center justify-center shrink-0">
                                <User className="w-6 h-6 text-[#003B5C]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-wider mb-2">Customer</h4>
                                <p className="text-[13px] font-bold text-gray-700 truncate">{order.userId?.name || order.shippingAddress?.firstName}</p>
                                <p className="text-[11px] text-gray-400 font-medium mb-3">{order.userId?.email || order.shippingAddress?.email}</p>
                                <p className="text-[11px] text-gray-400 font-bold mb-4">{order.shippingAddress?.phone || '+91 800 123 4567'}</p>
                                <button className="w-full py-2 bg-[#003B5C] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-opacity-90 transition-all">View Profile</button>
                            </div>
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-[#F0F2F5] rounded-xl flex items-center justify-center shrink-0">
                                <ShoppingBag className="w-6 h-6 text-gray-800" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-wider mb-2">Order Info</h4>
                                <p className="text-[11px] text-gray-400 font-bold flex justify-between mb-1">Shipping: <span className="text-gray-900">Next express</span></p>
                                <p className="text-[11px] text-gray-400 font-bold flex justify-between mb-1">Payment: <span className="text-gray-900">Net banking/Paytm</span></p>
                                <p className="text-[11px] text-gray-400 font-bold flex justify-between mb-4">Status: <span className="text-orange-500">{getStatusText(order.status)}</span></p>
                                <button className="w-full py-2 bg-[#003B5C] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-opacity-90 transition-all">Download Info</button>
                            </div>
                        </div>
                    </div>

                    {/* Deliver To */}
                    <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-[#F0F2F5] rounded-xl flex items-center justify-center shrink-0">
                                <Truck className="w-6 h-6 text-gray-800" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-wider mb-2">Deliver To</h4>
                                <p className="text-[11px] text-gray-900 font-bold leading-relaxed mb-4 line-clamp-2">
                                    {order.shippingAddress?.address || 'Kallurave Bharam Colony, Palani Vihar, Gurgaon, Haryana'}
                                </p>
                                <button className="w-full py-2 bg-[#003B5C] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-opacity-90 transition-all">View Profile</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                            <CreditCard className="w-5 h-5 text-red-500" />
                            <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-wider">Payment Info</h4>
                        </div>
                        <p className="text-[11px] text-gray-400 font-bold flex items-center mb-1">
                            <span className="w-2 h-2 rounded-full bg-red-400 mr-2" /> Master Card **** 444 8652
                        </p>
                        <p className="text-[11px] text-gray-500 mb-1">Business name: {order.userId?.name || 'Guest'}</p>
                        <p className="text-[11px] text-gray-500">Phone: {order.shippingAddress?.phone || '+91 984 233 1212'}</p>
                    </div>

                    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-wider">Note</h4>
                        </div>
                        <textarea
                            className="w-full h-16 bg-gray-50 border-none rounded-lg p-3 text-[11px] outline-none focus:ring-1 focus:ring-[#003B5C] resize-none"
                            placeholder="Type some notes"
                        ></textarea>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Products</h3>
                        <button className="text-gray-300"><MoreVertical className="w-5 h-5" /></button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-y border-gray-50 bg-[#F8F9FB]">
                                <tr>
                                    <th className="py-4 px-6 font-semibold text-gray-500 text-[10px] uppercase w-12">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    </th>
                                    <th className="py-4 px-4 font-bold text-gray-500 text-[10px] uppercase">Product Name</th>
                                    <th className="py-4 px-4 font-bold text-gray-500 text-[10px] uppercase">Order ID</th>
                                    <th className="py-4 px-4 font-bold text-gray-500 text-[10px] uppercase">Quantity</th>
                                    <th className="py-4 px-4 font-bold text-gray-500 text-[10px] uppercase text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {order.items?.map((item: any, i: number) => (
                                    <tr key={item._id || i} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                                    {item.productId?.images?.[0] ? (
                                                        <img src={item.productId.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-[13px] font-bold text-gray-900 truncate block">{item.productId?.name || 'Unknown Product'}</span>
                                                    <div className="flex items-center space-x-2 mt-0.5">
                                                        {item.selectedColor && (
                                                            <div className="w-2.5 h-2.5 rounded-full border border-gray-200" style={{ backgroundColor: item.selectedColor }} />
                                                        )}
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase">{item.selectedSize || 'Standard'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                                            #{(item._id || '').slice(-6).toUpperCase()}
                                        </td>
                                        <td className="py-4 px-4 text-[13px] font-black text-gray-900">
                                            {item.quantity}
                                        </td>
                                        <td className="py-4 px-8 text-right font-black text-gray-900 text-[13px]">
                                            {item.paidWithPoints ? (
                                                <span className="text-violet-600">
                                                    {(item.productId?.pointsPrice * item.quantity).toLocaleString()} pts
                                                </span>
                                            ) : (
                                                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <div className="w-full max-w-[280px] space-y-3">
                            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase">
                                <span>Subtotal</span>
                                <span className="text-gray-900 font-black">₹{order.totalAmount?.toLocaleString() || '0'}</span>
                            </div>

                            {/* Points Summary */}
                            {order.pointsUsed > 0 && (
                                <div className="flex justify-between text-[11px] font-bold text-violet-500 uppercase">
                                    <span>Points Used</span>
                                    <span className="font-black">-{order.pointsUsed.toLocaleString()} pts</span>
                                </div>
                            )}

                            {order.pointsEarned > 0 && (
                                <div className="flex justify-between text-[11px] font-bold text-green-600 uppercase">
                                    <span>Points Earned</span>
                                    <span className="font-black">+{order.pointsEarned.toLocaleString()} pts</span>
                                </div>
                            )}

                            <div className="flex justify-between text-base font-black text-gray-900 mt-4 uppercase tracking-wider border-t border-gray-100 pt-4">
                                <span>Total Paid</span>
                                <span className="text-xl">₹{order.totalAmount?.toLocaleString() || '0'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

import { ShoppingCart } from 'lucide-react';
