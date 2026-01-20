import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TrendBadgeProps {
    trend: string;
    isPositive: boolean;
}

export const TrendBadge: React.FC<TrendBadgeProps> = ({ trend, isPositive }) => {
    return (
        <div className={`text-xs flex items-center gap-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {trend}
            {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
        </div>
    );
};
