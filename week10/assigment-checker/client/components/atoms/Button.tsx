import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "glass" | "danger" | "outline";
    size?: "sm" | "md" | "lg" | "xl";
    children: React.ReactNode;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    className = "",
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-2xl";

    const variants = {
        primary: "bg-primary hover:bg-primary-glow text-white shadow-lg shadow-primary/20",
        secondary: "bg-secondary hover:bg-secondary-glow text-white shadow-lg shadow-secondary/20",
        glass: "glass border-white/5 bg-white/5 hover:bg-white/10 text-white",
        danger: "bg-danger hover:bg-danger/80 text-white shadow-lg shadow-danger/20",
        outline: "bg-transparent border border-white/10 hover:border-primary/50 text-white"
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
        xl: "px-12 py-5 text-lg rounded-3xl"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
