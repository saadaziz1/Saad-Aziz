"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfile } from '@/hooks/useProfile';
import { useRouter } from 'next/navigation';
import { User, LogOut, LayoutDashboard, Home, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const DashboardProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuthStore();
    const { profile, isLoadingProfile } = useProfile();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        router.push('/login');
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 lg:space-x-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg px-2 lg:px-3 py-1.5 border border-gray-100 cursor-pointer outline-none shadow-sm active:scale-95 duration-200"
            >
                <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-[#003B5C]/10 flex items-center justify-center overflow-hidden border border-[#003B5C]/20">
                    {profile?.avatar ? (
                        <Image
                            src={profile.avatar}
                            alt="Profile"
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-3 h-3 lg:w-4 lg:h-4 text-[#003B5C]" />
                    )}
                </div>
                <span className="text-[10px] lg:text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {profile?.role?.replace('_', ' ') || 'Admin'}
                </span>
                <ChevronDown className={cn(
                    "w-3 h-3 lg:w-4 lg:h-4 text-gray-400 transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-50 bg-[#F9FAFB]">
                        <p className="font-bold text-sm text-gray-900 truncate">
                            {profile?.name || 'Administrator'}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5 font-medium uppercase tracking-tight">
                            {profile?.role?.replace('_', ' ')}
                        </p>
                    </div>

                    <div className="py-1.5">
                        <button
                            onClick={() => handleNavigation('/')}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group"
                        >
                            <Home className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors" />
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-black">Home</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('/dashboard')}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group"
                        >
                            <LayoutDashboard className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors" />
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-black">Dashboard</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('/profile')}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group"
                        >
                            <User className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors" />
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-black">Profile</span>
                        </button>
                    </div>

                    <div className="border-t border-gray-50 py-1.5 bg-[#FFF5F5]/30">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 transition-colors text-left group"
                        >
                            <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-600 transition-colors" />
                            <span className="text-sm font-bold text-red-500 group-hover:text-red-600">Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardProfileDropdown;
