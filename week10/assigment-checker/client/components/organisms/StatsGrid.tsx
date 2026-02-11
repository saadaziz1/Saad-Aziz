import React from "react";
import StatCard from "../molecules/StatCard";

interface StatsGridProps {
    stats: {
        label: string;
        value: string | number;

        trend?: string;
    }[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <StatCard
                    key={i}
                    label={stat.label}
                    value={stat.value}

                    trend={stat.trend}
                />
            ))}
        </div>
    );
};

export default StatsGrid;
