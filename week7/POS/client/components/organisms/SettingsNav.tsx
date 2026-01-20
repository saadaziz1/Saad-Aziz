import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Heart, LayoutGrid, SlidersHorizontal, Package, Bell, Lock, Info } from "lucide-react";

export const settingsNavItems = [
    { icon: Heart, label: "Appereance", desc: "Dark and Light mode, Font size" },
    { icon: LayoutGrid, label: "Your Business", desc: "Business details, logo, etc" },
    { icon: SlidersHorizontal, label: "Products Management", desc: "Manage your product, pricing, etc" },
    { icon: Package, label: "Raw Materials", desc: "Manage materials and inventory" },
    { icon: Bell, label: "Notifications", desc: "Customize your notifications" },
    { icon: Lock, label: "Security", desc: "Configure Password, PIN, etc" },
    { icon: Info, label: "About Us", desc: "Find out more about Posly" },
];

interface SettingsNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const SettingsNav: React.FC<SettingsNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <Card className="w-full lg:w-[300px] bg-[#1F1D2B] border-none flex flex-row lg:flex-col pt-0 lg:pt-4 overflow-x-auto lg:overflow-y-auto custom-scrollbar h-auto lg:h-full rounded-xl shrink-0">
            {settingsNavItems.map((item) => {
                const isActive = activeTab === item.label;
                return (
                    <div
                        key={item.label}
                        onClick={() => onTabChange(item.label)}
                        className={cn(
                            "flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-4 p-4 lg:p-6 cursor-pointer border-b-4 lg:border-b-0 lg:border-l-4 transition-colors min-w-[110px] lg:min-w-0 justify-center lg:justify-start",
                            isActive
                                ? "bg-[#252836]/50 border-primary"
                                : "border-transparent hover:bg-[#252836]/30 text-gray-400"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5 mt-0 lg:mt-1", isActive ? "text-primary" : "text-gray-400")} />
                        <div className="text-center lg:text-left">
                            <h3 className={cn("font-medium text-sm lg:text-base whitespace-nowrap lg:whitespace-normal", isActive ? "text-white" : "text-gray-400")}>{item.label}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1 hidden lg:block">{item.desc}</p>
                        </div>
                    </div>
                )
            })}
        </Card>
    );
};
