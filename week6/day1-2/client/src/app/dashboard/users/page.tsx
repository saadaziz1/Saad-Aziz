"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-page/DashboardLayout';
import { useGetUsersQuery, useToggleUserStatusMutation, useChangeUserRoleMutation } from '@/api/userApi';
import {
    ChevronRight,
    MoreVertical,
    Search,
    Filter,
    User,
    Shield,
    ShieldAlert,
    Ban,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function UsersManagementPage() {
    const { data: users, isLoading } = useGetUsersQuery(undefined);
    const { profile } = useProfile();
    const [toggleStatus] = useToggleUserStatusMutation();
    const [changeRole] = useChangeUserRoleMutation();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState("");

    const handleToggleStatus = async (id: string) => {
        if (profile?._id === id) {
            toast.error("You cannot block yourself");
            return;
        }
        try {
            await toggleStatus(id).unwrap();
            toast.success("User status updated");
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleChangeRole = async (id: string, role: string) => {
        if (profile?._id === id) {
            toast.error("You cannot change your own role");
            return;
        }
        try {
            await changeRole({ id, role }).unwrap();
            toast.success("User role updated");
        } catch (err) {
            toast.error("Failed to update role");
        }
    };

    const filteredUsers = users?.filter((u: any) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-12 h-12 text-[#003B5C] animate-spin mb-4" />
                    <p className="text-gray-500 font-medium tracking-tight">Loading Users...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                        <span>Home</span>
                        <ChevronRight className="w-3 h-3 mx-1" />
                        <span className="text-gray-600">Users</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-[#003B5C] transition-all outline-none"
                        />
                    </div>
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 uppercase tracking-widest hover:bg-gray-50 transition-all">
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F9FB] border-b border-gray-50">
                            <tr>
                                <th className="py-4 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-wider">User</th>
                                <th className="py-4 px-4 font-bold text-gray-500 text-[10px] uppercase tracking-wider">Role</th>
                                <th className="py-4 px-4 font-bold text-gray-500 text-[10px] uppercase tracking-wider">Status</th>
                                <th className="py-4 px-4 font-bold text-gray-500 text-[10px] uppercase tracking-wider">Joined Date</th>
                                <th className="py-4 px-8 font-bold text-gray-500 text-[10px] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <User className="w-12 h-12 text-gray-200 mb-2" />
                                            <p className="text-gray-500 font-medium">No users found matching your search</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user: any) => (
                                    <tr
                                        key={user._id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/dashboard/users/${user._id}`)}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-[#F0F2F5] rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
                                                    ) : (
                                                        <User className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-[14px] font-bold text-gray-900 block truncate">{user.name}</span>
                                                    <span className="text-[11px] text-gray-400 font-medium block truncate">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                {user.role === 'SUPER_ADMIN' ? (
                                                    <ShieldAlert className="w-4 h-4 text-red-500" />
                                                ) : user.role === 'ADMIN' ? (
                                                    <Shield className="w-4 h-4 text-blue-500" />
                                                ) : (
                                                    <User className="w-4 h-4 text-gray-400" />
                                                )}
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleChangeRole(user._id, e.target.value);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-transparent border-none text-[12px] font-bold text-gray-700 p-0 focus:ring-0 outline-none uppercase tracking-tighter cursor-pointer"
                                                >
                                                    <option value="USER">User</option>
                                                    <option value="ADMIN">Admin</option>
                                                    <option value="SUPER_ADMIN">Super Admin</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {user.isActive ? (
                                                <div className="flex items-center text-green-500 space-x-2">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span className="text-[11px] font-black uppercase">Active</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-red-500 space-x-2">
                                                    <Ban className="w-4 h-4" />
                                                    <span className="text-[11px] font-black uppercase">Blocked</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-[13px] font-bold text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-8 text-right">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleStatus(user._id);
                                                    }}
                                                    className={cn(
                                                        "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                                        user.isActive
                                                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                                                            : "bg-green-50 text-green-600 hover:bg-green-100"
                                                    )}
                                                >
                                                    {user.isActive ? "Block" : "Unblock"}
                                                </button>
                                                <button
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 text-gray-300 hover:text-gray-500 transition-colors"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
