"use client";

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfile } from '@/hooks/useProfile';
import { useRouter } from 'next/navigation';
import { User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const { profile } = useProfile();
    const router = useRouter();

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        router.push('/');
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Profile"
            >
                <div className="w-[22px] h-[22px] rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {profile?.avatar ? (
                        <Image
                            src={profile.avatar}
                            alt="Profile"
                            width={22}
                            height={22}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-[14px] h-[14px] text-gray-600" />
                    )}
                </div>
                <ChevronDown className={cn(
                    "w-3 h-3 text-gray-600 transition-transform hidden md:block",
                    isOpen && "rotate-180"
                )} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-40 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <p className="font-bold text-sm text-gray-900 truncate">
                                {profile?.name || user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                {profile?.email || user?.email}
                            </p>
                            {isAdmin && (
                                <span className="inline-block mt-2 px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold uppercase tracking-wider rounded">
                                    {user?.role?.replace('_', ' ')}
                                </span>
                            )}
                        </div>

                        <div className="py-2">
                            <button
                                onClick={() => handleNavigation('/profile')}
                                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                            >
                                <User className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-900">Profile</span>
                            </button>

                            {isAdmin && (
                                <button
                                    onClick={() => handleNavigation('/dashboard')}
                                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <LayoutDashboard className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-900">Dashboard</span>
                                </button>
                            )}
                        </div>

                        <div className="border-t border-gray-100 py-2">
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 transition-colors text-left group"
                            >
                                <LogOut className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                                <span className="text-sm font-medium text-gray-900 group-hover:text-red-600">Logout</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfileDropdown;
