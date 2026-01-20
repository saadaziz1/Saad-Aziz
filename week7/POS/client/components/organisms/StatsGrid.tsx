import React from 'react';
import { StatCard } from '../molecules/StatCard';

interface StatsGridProps {
    stats: any[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
                <StatCard key={i} {...stat} />
            ))}
        </div>
    );
};
