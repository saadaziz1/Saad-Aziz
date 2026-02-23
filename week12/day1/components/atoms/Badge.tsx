import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'outline'
}

export const Badge = ({ className, variant = 'primary', children, ...props }: BadgeProps) => {
    const variants = {
        primary: 'bg-white/10 text-white/80 border-white/20',
        success: 'bg-green-500/10 text-green-400 border-green-500/20',
        warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        error: 'bg-red-500/10 text-red-400 border-red-500/20',
        outline: 'bg-transparent text-white/60 border-white/10'
    }

    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
