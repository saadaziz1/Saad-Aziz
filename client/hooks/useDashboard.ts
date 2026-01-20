import { useState, useEffect } from "react";
import { useGetDashboardStatsQuery } from "@/libreduxservices/dashboardApi";
import dayjs from "dayjs";

export const useDashboard = () => {
    const { data: stats, isLoading, error, refetch } = useGetDashboardStatsQuery({});
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        setCurrentDate(dayjs().format("dddd D MMM, YYYY"));
    }, []);

    // Transform backend data to frontend format if necessary
    // Summary from backend: { totalSales, totalOrders, lowStockCount }
    // We can map these to the stats grid

    const formattedStats = [
        {
            label: "Total Revenue",
            value: `$${(stats?.summary?.totalSales || 0).toLocaleString()}`,
            trend: "+32.40%", // Hardcoded for now as backend doesn't provide trend yet
            isPositive: true,
            icon: "$"
        },
        {
            label: "Total Orders",
            value: (stats?.summary?.totalOrders || 0).toString(),
            trend: "-12.40%",
            isPositive: false,
            icon: "🔖"
        },
        {
            label: "Low Stock Items",
            value: (stats?.summary?.lowStockCount || 0).toString(),
            trend: "+2.40%",
            isPositive: true,
            icon: "👤"
        },
    ];

    return {
        stats: formattedStats,
        orderReport: stats?.recentOrders?.map((order: any) => ({
            customer: order.processedBy?.name || "Staff",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${order.processedBy?.name || "Staff"}`,
            menu: `${order.items?.length || 0} items`,
            payment: `$${order.totalAmount?.toFixed(2)}`,
            status: order.status || "Completed"
        })) || [],
        mostOrdered: stats?.topProducts?.map((p: any) => ({
            ...p,
            image: p.image || `https://api.dicebear.com/7.x/identicon/svg?seed=${p.name}`
        })) || [],
        pieData: stats?.pieData?.map((item: any, index: number) => {
            const colors = ["#EA7C69", "#FFB572", "#65B0F6"];
            return {
                ...item,
                color: colors[index % colors.length]
            };
        }) || [],
        currentDate,
        isLoading,
        error,
        refetch
    };
};
