import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-white/60 px-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all backdrop-blur-sm',
                        error && 'border-red-500/50 focus:ring-red-500/10 focus:border-red-500/50',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-400 px-1">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }
