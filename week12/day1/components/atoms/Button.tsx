'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md',
            secondary: 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/20 backdrop-blur-md',
            outline: 'bg-transparent hover:bg-white/5 text-white border border-white/20 backdrop-blur-md',
            ghost: 'bg-transparent hover:bg-white/5 text-white'
        }

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-6 py-2.5 text-sm',
            lg: 'px-8 py-3.5 text-base'
        }

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...(props as any)}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : null}
                {children}
            </motion.button>
        )
    }
)

Button.displayName = 'Button'

export { Button }
