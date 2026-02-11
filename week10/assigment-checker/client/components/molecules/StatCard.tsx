import React from "react";

interface StatCardProps {
    label: string;
    value: string | number;

    trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend }) => {
    return (
        <div className="glass p-6 rounded-3xl space-y-3 glass-hover">
            <div className="space-y-1">
                <div className="text-3xl font-extrabold text-white">{value}</div>
                <div className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                    {label}
                </div>
            </div>
            {trend && (
                <div className="text-xs font-bold text-accent italic">
                    {trend}
                </div>
            )}
        </div>
    );
};

export default StatCard;
