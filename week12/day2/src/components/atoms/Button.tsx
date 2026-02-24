import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20 active:scale-95 transition-all duration-200',
            secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700',
            outline: 'bg-transparent border-2 border-red-600 text-red-500 hover:bg-red-600/10',
            ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800',
            danger: 'bg-red-950/50 text-red-500 border border-red-900/50 hover:bg-red-900/50',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs font-medium',
            md: 'px-5 py-2.5 text-sm font-semibold',
            lg: 'px-8 py-3.5 text-base font-bold tracking-wide',
            icon: 'p-2',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <svg
                            className="animate-spin h-4 w-4 text-current"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span>Processing...</span>
                    </div>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';
