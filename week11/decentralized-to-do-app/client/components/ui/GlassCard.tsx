import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
    return (
        <div
            className={cn(
                "backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-6",
                "transition-all duration-300 hover:bg-white/10 hover:border-white/20",
                className
            )}
        >
            {children}
        </div>
    );
}
