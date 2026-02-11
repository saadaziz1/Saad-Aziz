"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface SidebarProps {
    navItems: {
        name: string;
        href: string;
        icon: React.ReactNode;
    }[];
    user: {
        name: string;
        role: string;
        avatar: string;
        rollNumber?: string;
    };
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, user, onClose }) => {
    const pathname = usePathname();

    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    return (
        <aside className="w-72 glass border-r border-card-border p-6 flex flex-col h-full bg-background lg:bg-transparent">
            <div className="flex items-center justify-between mb-12 px-2">
                <div className="flex items-center space-x-3 mb-6 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border border-white/10" />
                    <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-sm text-white truncate">{user.name}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">{user.role}</span>
                            {user.rollNumber && (
                                <span className="text-[10px] font-mono text-primary bg-primary/10 px-1 rounded-sm">
                                    {user.rollNumber}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Close Button for Mobile */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-foreground/40 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname === item.href
                            ? "bg-primary/20 text-primary border border-primary/20"
                            : "text-foreground/60 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <div className={pathname === item.href ? "text-primary" : "text-foreground/40"}>
                            {item.icon}
                        </div>
                        <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-card-border space-y-4">


                <button
                    onClick={() => {
                        useAuthStore.getState().logout();
                        window.location.href = '/login'; // Force full reload to clear any memory state/cache if needed
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-danger/60 hover:text-danger hover:bg-danger/10 transition-all duration-200 group w-full text-left"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-bold text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
