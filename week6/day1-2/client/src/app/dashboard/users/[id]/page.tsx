"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetUserQuery, useToggleUserStatusMutation, useChangeUserRoleMutation } from '@/api/userApi';
import { useGetOrdersByUserQuery } from '@/api/ordersApi';
import { useProfile } from '@/hooks/useProfile';
import { DashboardLayout } from '@/components/dashboard-page/DashboardLayout';
import {
    ChevronRight,
    User,
    Mail,
    Shield,
    Calendar,
    ShoppingBag,
    DollarSign,
    Award,
    Loader2,
    ArrowLeft,
    ShieldAlert,
    Ban,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function UserDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: user, isLoading } = useGetUserQuery(id as string);
    const { profile } = useProfile(); // Get current admin profile

    // Only fetch orders if the target user is a regular USER
    const shouldFetchOrders = user?.role === 'USER';
    const { data: userOrders = [], isLoading: isLoadingOrders } = useGetOrdersByUserQuery(id as string, {
        skip: !shouldFetchOrders
    });

    const [toggleStatus] = useToggleUserStatusMutation();
    const [changeRole] = useChangeUserRoleMutation();

    const isSelf = profile?._id === id;
    const isTargetSuperAdmin = user?.role === 'SUPER_ADMIN';

    const handleToggleStatus = async () => {
        if (isSelf) {
            toast.error("You cannot block yourself");
            return;
        }
        try {
            await toggleStatus(id as string).unwrap();
            toast.success("User status updated");
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleChangeRole = async (role: string) => {
        try {
            await changeRole({ id: id as string, role }).unwrap();
            toast.success("User role updated");
        } catch (err) {
            toast.error("Failed to update role");
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-10 h-10 animate-spin text-[#003B5C]" />
                </div>
            </DashboardLayout>
        );
    }

    if (!user) {
        return (
            <DashboardLayout>
                <div className="text-center py-20">
                    <User className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900">User Not Found</h2>
                    <button
                        onClick={() => router.push('/dashboard/users')}
                        className="mt-4 text-[#003B5C] font-bold uppercase text-xs tracking-widest flex items-center justify-center mx-auto"
                    >
                        <ArrowLeft className="w-3 h-3 mr-2" /> Back to Users
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <button
                    onClick={() => router.push('/dashboard/users')}
                    className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-[#003B5C] transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
                </button>
                <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                    <span>Home</span>
                    <ChevronRight className="w-3 h-3 mx-1" />
                    <span>Users</span>
                    <ChevronRight className="w-3 h-3 mx-1" />
                    <span className="text-gray-600">{user.name}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                        <div className="w-24 h-24 bg-[#F0F2F5] rounded-3xl mx-auto mb-4 flex items-center justify-center overflow-hidden border-2 border-white shadow-md ring-1 ring-gray-100">
                            {user.avatar ? (
                                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-gray-300" />
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
                        <p className="text-sm text-gray-400 mb-6">{user.email}</p>

                        <div className="flex items-center justify-center space-x-2 mb-8">
                            {user.isActive ? (
                                <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center">
                                    <CheckCircle2 className="w-3 h-3 mr-2" /> Active
                                </span>
                            ) : (
                                <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center">
                                    <Ban className="w-3 h-3 mr-2" /> Blocked
                                </span>
                            )}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-gray-50">
                            <button
                                onClick={handleToggleStatus}
                                className={cn(
                                    "w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                                    user.isActive
                                        ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                                        : "bg-green-600 text-white hover:bg-green-700 shadow-md"
                                )}
                            >
                                {user.isActive ? "Block User" : "Unblock User"}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">User Permissions</h3>
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Assign Role</label>
                            <div className="grid grid-cols-1 gap-2">
                                {['USER', 'ADMIN', 'SUPER_ADMIN'].map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => handleChangeRole(role)}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-xl border text-[11px] font-bold transition-all",
                                            user.role === role
                                                ? "bg-[#003B5C] border-[#003B5C] text-white shadow-md"
                                                : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
                                        )}
                                    >
                                        <div className="flex items-center">
                                            {role === 'SUPER_ADMIN' ? <ShieldAlert className="w-4 h-4 mr-3" /> : role === 'ADMIN' ? <Shield className="w-4 h-4 mr-3" /> : <User className="w-4 h-4 mr-3" />}
                                            {role.replace('_', ' ')}
                                        </div>
                                        {user.role === role && <CheckCircle2 className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4 transition-transform hover:scale-[1.02]">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                <ShoppingBag className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
                                <p className="text-xl font-black text-gray-900">{user.totalOrders || 0}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4 transition-transform hover:scale-[1.02]">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                                <DollarSign className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Spent</p>
                                <p className="text-xl font-black text-gray-900">₹{(user.totalSpent || 0).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4 transition-transform hover:scale-[1.02]">
                            <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center shrink-0">
                                <Award className="w-6 h-6 text-violet-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loyalty Points</p>
                                <p className="text-xl font-black text-gray-900">{user.loyaltyPoints || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-8 flex items-center">
                            <User className="w-4 h-4 mr-2" /> General Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center">
                                    <Mail className="w-3 h-3 mr-2" /> Email Address
                                </label>
                                <p className="text-[13px] font-bold text-gray-900">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center">
                                    <Calendar className="w-3 h-3 mr-2" /> Register Date
                                </label>
                                <p className="text-[13px] font-bold text-gray-900">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center">
                                    <Shield className="w-3 h-3 mr-2" /> Current Role
                                </label>
                                <p className="text-[13px] font-black text-[#003B5C] uppercase">{user.role}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center">
                                    <CheckCircle2 className="w-3 h-3 mr-2" /> Account Status
                                </label>
                                <p className={cn("text-[13px] font-black uppercase", user.isActive ? "text-green-500" : "text-red-500")}>
                                    {user.isActive ? "Active" : "Blocked"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order History - Only for USER role */}
                    {shouldFetchOrders && (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-[#F8F9FB]/50">
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Order History</h3>
                                <button
                                    onClick={() => router.push('/dashboard/orders')}
                                    className="text-[10px] font-black text-[#003B5C] uppercase tracking-widest hover:underline"
                                >
                                    View All Orders
                                </button>
                            </div>

                            {userOrders.length === 0 ? (
                                <div className="p-8 flex flex-col items-center justify-center py-12 text-gray-400">
                                    <ShoppingBag className="w-12 h-12 opacity-20 mx-auto mb-4" />
                                    <p className="text-xs font-bold uppercase tracking-tight mb-1">No orders yet</p>
                                    <p className="text-[10px] text-gray-400">This user hasn't placed any orders.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100/50">
                                            <tr>
                                                <th className="py-4 px-6 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Order ID</th>
                                                <th className="py-4 px-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Date</th>
                                                <th className="py-4 px-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Status</th>
                                                <th className="py-4 px-6 font-bold text-gray-400 text-[10px] uppercase tracking-wider text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {userOrders.map((order: any) => (
                                                <tr key={order._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/orders/${order._id}`)}>
                                                    <td className="py-4 px-6 text-[11px] font-bold text-gray-900 uppercase tracking-tighter">
                                                        #{order._id.slice(-6)}
                                                    </td>
                                                    <td className="py-4 px-4 text-[11px] font-bold text-gray-500">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={cn(
                                                            "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                                                            order.status === 'DELIVERED' ? 'bg-blue-50 text-blue-600' :
                                                                order.status === 'CANCELLED' ? 'bg-orange-50 text-orange-600' :
                                                                    order.status === 'SHIPPED' ? 'bg-purple-50 text-purple-600' :
                                                                        'bg-yellow-50 text-yellow-600'
                                                        )}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <div className="flex flex-col items-end">
                                                            <span className="font-black text-gray-900 text-[12px]">₹{(order.totalAmount || 0).toLocaleString()}</span>
                                                            {order.pointsUsed > 0 && (
                                                                <span className="text-[9px] font-bold text-violet-500">
                                                                    {order.pointsUsed.toLocaleString()} pts
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
