"use client";


import { StatsCards, SalesChart, RecentOrders, BestSellers } from "@/components/dashboard-page";
import { DashboardLayout } from "@/components/dashboard-page/DashboardLayout";

export default function DashboardPage() {


    return (
        <DashboardLayout>
            {/* Stats Cards */}
            <StatsCards />

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SalesChart />
                <BestSellers />
            </div>

            {/* Recent Orders */}
            <RecentOrders />
        </DashboardLayout>
    );
}
