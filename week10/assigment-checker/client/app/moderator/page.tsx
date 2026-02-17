"use client";

import React from "react";
import { useUsers } from "@/hooks/useUsers";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/atoms/Loader";

export default function UserManagementPage() {
    const { users, isLoading, toggleBlock, changeRole, processingIds } = useUsers();
    const currentUser = useAuthStore(state => state.user);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader size="xl" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">User Management</h1>
                    <p className="text-foreground/60 font-medium">Manage permissions and access control for all users.</p>
                </div>
            </div>

            <div className="glass rounded-4xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 text-center w-16">#</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">User</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Role</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user, index) => {
                                const isProcessing = processingIds.includes(user._id);
                                return (
                                    <tr key={user._id} className={`transition-colors duration-200 group ${isProcessing ? "opacity-50 pointer-events-none" : "hover:bg-white/2"}`}>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-mono text-foreground/40 text-center">{index + 1}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                                                        {user.firstName} {user.lastName}
                                                    </span>
                                                    <span className="text-[10px] text-foreground/40 font-mono tracking-tight">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user._id === currentUser?.id ? (
                                                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
                                                    {user.role}
                                                </div>
                                            ) : (
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => changeRole(user._id, e.target.value)}
                                                    disabled={isProcessing}
                                                    className="bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary focus:outline-none focus:border-primary/50 transition-all px-2 py-1 cursor-pointer hover:bg-white/10 appearance-none pr-8 relative disabled:cursor-not-allowed"
                                                    style={{
                                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'right 0.5rem center',
                                                        backgroundSize: '1rem'
                                                    }}
                                                >
                                                    <option value="student" className="bg-[#0a0a0a] text-white">Student</option>
                                                    <option value="teacher" className="bg-[#0a0a0a] text-white">Teacher</option>
                                                    <option value="moderator" className="bg-[#0a0a0a] text-white">Moderator</option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.isBlocked
                                                ? "bg-danger/10 border border-danger/20 text-danger"
                                                : "bg-success/10 border border-success/20 text-success"
                                                }`}>
                                                {user.isBlocked ? "Blocked" : "Active"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user._id !== currentUser?.id && (
                                                <button
                                                    onClick={() => toggleBlock(user._id)}
                                                    disabled={isProcessing}
                                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${user.isBlocked
                                                        ? "bg-success/10 text-success hover:bg-success/20 border border-success/20"
                                                        : "bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20"
                                                        }`}
                                                >
                                                    {isProcessing ? "Wait..." : (user.isBlocked ? "Unblock" : "Block")}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
