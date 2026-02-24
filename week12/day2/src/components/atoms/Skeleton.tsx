import React from 'react';
import { cn } from '@/src/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-zinc-800/50",
                className
            )}
            {...props}
        />
    );
};
