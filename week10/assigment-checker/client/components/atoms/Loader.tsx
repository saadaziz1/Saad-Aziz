import React from 'react';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    className?: string;
    fullScreen?: boolean;
}

const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
};

const Loader: React.FC<LoaderProps> = ({ size = 'lg', text, className = '', fullScreen = false }) => {
    const spinner = (
        <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
            <div className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20`}></div>
            {text && (
                <p className="text-foreground/40 font-bold tracking-widest uppercase text-[10px] animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default Loader;
