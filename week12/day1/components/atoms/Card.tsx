'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLMotionProps<'div'> {
    glass?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, glass = true, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    'rounded-3xl p-6 border',
                    glass ? 'bg-white/5 border-white/10 backdrop-blur-xl' : 'bg-transparent border-white/5',
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)

Card.displayName = 'Card'

export { Card }
