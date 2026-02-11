import React from "react";

interface ProgressBarProps {
    progress: number;
    variant?: "primary" | "secondary" | "accent";
    showValue?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    variant = "primary",
    showValue = false
}) => {
    const colors = {
        primary: "bg-primary shadow-[0_0_10px_#6366F1]",
        secondary: "bg-secondary shadow-[0_0_10px_#0EA5E9]",
        accent: "bg-accent shadow-[0_0_10px_#10B981]"
    };

    return (
        <div className="space-y-2">
            {showValue && (
                <div className="flex justify-end">
                    <span className="text-xs font-black text-white">{Math.floor(progress)}%</span>
                </div>
            )}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ease-out ${colors[variant]}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
