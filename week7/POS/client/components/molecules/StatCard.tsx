import React from 'react';
import { Card } from '@/components/ui/card';
import { StatIcon } from '../atoms/StatIcon';
import { TrendBadge } from '../atoms/TrendBadge';

interface StatCardProps {
    label: string;
    value: string;
    trend: string;
    isPositive: boolean;
    icon: string | React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, trend, isPositive, icon }) => {
    return (
        <Card className="bg-[#1F1D2B] border-none text-white p-4">
            <div className="flex items-center gap-3 mb-2">
                <StatIcon icon={icon} />
                <TrendBadge trend={trend} isPositive={isPositive} />
            </div>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className="text-muted-foreground text-sm">{label}</div>
        </Card>
    );
};
