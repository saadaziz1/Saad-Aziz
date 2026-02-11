import React from "react";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "accent" | "danger" | "neutral";
    pulse?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    variant = "primary",
    pulse = false
}) => {
    const base = "text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black";

    const variants = {
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary",
        accent: "bg-accent/10 text-accent",
        danger: "bg-danger/10 text-danger",
        neutral: "bg-white/10 text-white"
    };

    return (
        <span className={`${base} ${variants[variant]} ${pulse ? "animate-pulse" : ""}`}>
            {children}
        </span>
    );
};

export default Badge;
