"use client";

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useDashboard } from '@/hooks/useDashboard';
import { useDashboardStore } from '@/store/useDashboardStore';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const SalesChart = () => {
    const { orders } = useDashboard();
    const { selectedPeriod, setSelectedPeriod } = useDashboardStore();

    const periods = [
        { key: 'week', label: 'WEEKLY' },
        { key: 'month', label: 'MONTHLY' },
        { key: 'year', label: 'YEARLY' },
    ];

    // Generate dynamic sales data based on actual orders
    const getSalesData = () => {
        const now = new Date();
        let labels: string[] = [];
        let data: number[] = [];

        if (selectedPeriod === 'week' || selectedPeriod === 'today') {
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                labels.push(date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase());

                const dailyOrders = orders.filter((order: any) => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate.toDateString() === date.toDateString();
                });
                data.push(dailyOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0));
            }
        } else if (selectedPeriod === 'month') {
            // Last 6 months (as in image: JUL, AUG, SEP, OCT, NOV, DEC)
            for (let i = 5; i >= 0; i--) {
                const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
                labels.push(month.toLocaleDateString('en-US', { month: 'short' }).toUpperCase());

                const monthlyOrders = orders.filter((order: any) => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate.getMonth() === month.getMonth() &&
                        orderDate.getFullYear() === month.getFullYear();
                });
                data.push(monthlyOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0));
            }
        } else {
            // Last 12 months
            for (let i = 11; i >= 0; i--) {
                const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
                labels.push(month.toLocaleDateString('en-US', { month: 'short' }).toUpperCase());

                const monthlyOrders = orders.filter((order: any) => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate.getMonth() === month.getMonth() &&
                        orderDate.getFullYear() === month.getFullYear();
                });
                data.push(monthlyOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0));
            }
        }

        return { labels, data };
    };

    const { labels, data } = getSalesData();

    const chartData = {
        labels,
        datasets: [
            {
                data,
                borderColor: '#4A90E2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#4A90E2',
                pointBorderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBorderWidth: 3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#003B5C',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: (context: any) => `₹${context.parsed.y.toLocaleString()}`,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 10,
                        weight: 'bold' as const,
                    },
                    padding: 10,
                },
            },
            y: {
                grid: {
                    color: '#f3f4f6',
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 10,
                        weight: 'bold' as const,
                    },
                    padding: 10,
                    callback: (value: any) => `₹${value.toLocaleString()}`,
                },
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Sale Graph</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {periods.map((period) => (
                        <button
                            key={period.key}
                            onClick={() => setSelectedPeriod(period.key as any)}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${selectedPeriod === period.key || (selectedPeriod === 'today' && period.key === 'week')
                                    ? 'bg-[#003B5C] text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-64">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};