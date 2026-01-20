import React from 'react';
import { StatsGrid } from '../organisms/StatsGrid';
import { OrderReportTable } from '../organisms/OrderReportTable';
import { MostOrderedCard } from '../organisms/MostOrderedCard';
import { OrderTypeCard } from '../organisms/OrderTypeCard';

interface DashboardTemplateProps {
    stats: any[];
    orderReport: any[];
    mostOrdered: any[];
    pieData: any[];
    currentDate: string;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
    stats,
    orderReport,
    mostOrdered,
    pieData,
    currentDate
}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:h-full   w-full">
            {/* Left Content */}
            <div className="flex-1 flex flex-col gap-8 lg:overflow-y-auto no-scrollbar pb-20 lg:pb-0">
                {/* Header */}
                <div className="flex flex-col gap-1 sticky top-0 bg-[#252836] z-10 py-2">
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-[#ABBBC2] text-sm">{currentDate}</p>
                </div>

                <StatsGrid stats={stats} />

                <OrderReportTable orders={orderReport} />
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-[400px] flex flex-col gap-8 lg:overflow-y-auto no-scrollbar pb-8 lg:pb-0">
                <MostOrderedCard items={mostOrdered} />
                <OrderTypeCard data={pieData} />
            </div>
        </div>
    );
};
