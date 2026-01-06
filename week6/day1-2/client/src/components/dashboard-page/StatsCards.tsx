import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { ShoppingBag, ShoppingCart, CheckCircle, RotateCcw } from 'lucide-react';

export const StatsCards = () => {
    const { stats, isLoadingOrders } = useDashboard();

    if (isLoadingOrders) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: 'Total Sales',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            change: '+34.7%',
            icon: ShoppingBag,
            bgColor: 'bg-[#003B5C]',
            iconColor: 'text-white',
            compare: 'Compared to Oct 2023',
        },
        {
            title: 'Active Orders',
            value: stats.activeOrders.toLocaleString(),
            change: '+34.7%',
            icon: ShoppingCart,
            bgColor: 'bg-[#003B5C]',
            iconColor: 'text-white',
            compare: 'Compared to Oct 2023',
        },
        {
            title: 'Completed Orders',
            value: stats.completedOrders.toLocaleString(),
            change: '+34.7%',
            icon: CheckCircle,
            bgColor: 'bg-[#003B5C]',
            iconColor: 'text-white',
            compare: 'Compared to Oct 2023',
        },
        {
            title: 'Return Orders',
            value: stats.returnOrders.toLocaleString(),
            change: '+34.7%',
            icon: RotateCcw,
            bgColor: 'bg-[#003B5C]',
            iconColor: 'text-white',
            compare: 'Compared to Oct 2023',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, index) => (
                <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-gray-900 text-sm font-bold">{card.title}</h3>
                        <button className="text-gray-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                        </button>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                                <span className="text-xl font-bold text-gray-900">{card.value}</span>
                                <div className="flex items-center text-green-500 text-xs font-medium">
                                    <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                    </svg>
                                    {card.change}
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400">{card.compare}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};