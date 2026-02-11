"use client";

import Sidebar from "@/components/organisms/Sidebar";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import { useAuthStore } from "@/store/authStore";

const navItems = [
    {
        name: "User Management", href: "/moderator", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        )
    }
];

export default function ModeratorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useAuthStore(state => state.user);

    const moderatorUser = {
        name: user?.name || "Moderator",
        role: "Moderator",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'Moderator'}`
    };

    return (
        <DashboardTemplate sidebar={<Sidebar navItems={navItems} user={moderatorUser} />}>
            {children}
        </DashboardTemplate>
    );
}
