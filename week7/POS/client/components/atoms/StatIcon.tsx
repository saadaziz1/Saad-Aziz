import React from 'react';

interface StatIconProps {
    icon: string | React.ReactNode;
}

export const StatIcon: React.FC<StatIconProps> = ({ icon }) => {
    return (
        <div className="w-8 h-8 rounded-lg bg-[#252836] flex items-center justify-center text-primary">
            {typeof icon === 'string' ? (
                icon === "$" ? <span className="font-bold underline text-primary">$</span> : <span>{icon}</span>
            ) : (
                icon
            )}
        </div>
    );
};
