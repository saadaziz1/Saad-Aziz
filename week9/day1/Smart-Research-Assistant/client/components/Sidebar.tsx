"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Search, FileText, Database, X, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    onUploadClick?: () => void;
    isUploading?: boolean;
}

export const Sidebar = ({ onUploadClick, isUploading }: SidebarProps) => {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed left-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-white/10 lg:hidden"
            >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                {/* Note: Using Search rotated as a "Menu" alternative or just Menu. Let's strictly use Menu and X */}
                <span className="sr-only">Toggle Menu</span>
            </button>
            <div className={`fixed left-6 top-6 z-50 lg:hidden ${isMobileOpen ? 'visible' : 'invisible'}`}>
                {/* Re-rendering button inside proper z-index context if needed, but the above button should work. 
                     Actually, let's just make the button toggle.
                     For the icon, I will import Menu and X.
                  */}
            </div>

            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed left-0 top-0 z-50 h-screen w-72 flex-col border-r border-white/10 bg-black/80 backdrop-blur-xl transition-transform duration-300 lg:flex lg:translate-x-0 lg:bg-black/40",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between px-8 py-10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
                            <Database size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            RESEARCH
                        </span>
                    </div>
                    {/* Close button inside sidebar for mobile */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 px-4">
                    <NavItem icon={<Search size={20} />} label="Analyze" href="/" active={pathname === "/"} />
                    <NavItem icon={<FileText size={20} />} label="Knowledge Base" href="/knowledge-base" active={pathname === "/knowledge-base"} />
                </nav>
            </aside>
        </>
    );
};

const NavItem = ({
    icon,
    label,
    href,
    active = false,
}: {
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
}) => (
    <Link
        href={href}
        className={cn(
            "flex cursor-pointer items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-200",
            active
                ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                : "text-zinc-500 hover:bg-white/5 hover:text-white"
        )}
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </Link>
);
