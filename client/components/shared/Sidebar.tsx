"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Home, Percent, PieChart, Mail, Bell, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/libredux/hooks";
import { logout } from "@/libreduxslices/authSlice";
import { useRouter } from "next/navigation";

const navItems = [
    { icon: Home, href: "/pos", label: "Home" },

    { icon: PieChart, href: "/", label: "Dashboard" },

    { icon: Settings, href: "/settings", label: "Settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-[104px] bg-[#1F1D2B] flex-col items-center py-6 gap-8 rounded-r-3xl">
                <div className="w-14 h-14 bg-[#56363B] bg-opacity-40 rounded-xl flex items-center justify-center text-primary mb-2">
                    <Store className="w-8 h-8 text-primary" />
                </div>

                <nav className="flex flex-col gap-6 w-full items-center flex-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "w-full flex justify-center relative py-4 group",
                                    isActive ? "text-white" : "text-[#EA7C69] hover:text-white transition-colors"
                                )}
                            >
                                <div className={cn(
                                    "w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-300",
                                    isActive ? "bg-primary shadow-[0px_8px_24px_rgba(234,124,105,0.32)] text-white translate-x-3" : "text-primary group-hover:bg-[#252836] group-hover:text-white"
                                )}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pb-4">
                    <button
                        onClick={handleLogout}
                        className="w-14 h-14 flex items-center justify-center text-primary hover:text-white hover:bg-[#252836] rounded-xl transition-colors cursor-pointer"
                    >
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navbar */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#1F1D2B] h-20 flex justify-around items-center rounded-t-3xl z-50 px-6 shadow-2xl pb-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "p-3 rounded-xl transition-all duration-300",
                                isActive ? "bg-primary text-white shadow-lg -translate-y-2" : "text-[#EA7C69] hover:bg-[#252836]"
                            )}
                        >
                            <item.icon className="w-6 h-6" />
                        </Link>
                    );
                })}
                <button
                    onClick={handleLogout}
                    className="p-3 text-[#EA7C69] hover:bg-[#252836] rounded-xl transition-all"
                >
                    <LogOut className="w-6 h-6" />
                </button>
            </div>
        </>
    );
}
