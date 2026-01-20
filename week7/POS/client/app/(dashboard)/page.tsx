"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { stats, orderReport, mostOrdered, pieData, currentDate, isLoading, error } = useDashboard();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)] text-red-500">
                Failed to load dashboard data. Please try again.
            </div>
        );
    }

    return (
        <DashboardTemplate
            stats={stats}
            orderReport={orderReport}
            mostOrdered={mostOrdered}
            pieData={pieData}
            currentDate={currentDate}
        />
    );
}
