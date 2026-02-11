import React from "react";

interface MarkingModeCardProps {
    mode: "strict" | "loose";
    isActive: boolean;
    onClick: () => void;
    title: string;
    description: string;
    icon: string;
}

const MarkingModeCard: React.FC<MarkingModeCardProps> = ({
    mode,
    isActive,
    onClick,
    title,
    description,
    icon
}) => {
    const activeStyles = mode === "strict"
        ? "bg-primary/20 border-primary shadow-[0_0_30px_rgba(99,102,241,0.2)]"
        : "bg-secondary/20 border-secondary shadow-[0_0_30px_rgba(14,165,233,0.2)]";

    return (
        <div
            onClick={onClick}
            className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${isActive
                ? activeStyles
                : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="text-2xl">{icon}</div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive
                    ? mode === "strict" ? "border-primary bg-primary" : "border-secondary bg-secondary"
                    : "border-white/20"
                    }`}>
                    {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">{description}</p>
        </div>
    );
};

export default MarkingModeCard;
