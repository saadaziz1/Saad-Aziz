import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading: React.FC<HeadingProps> = ({ level = 1, className, children, ...props }) => {
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

    const levels = {
        1: 'text-4xl md:text-6xl font-black uppercase tracking-tighter',
        2: 'text-3xl md:text-4xl font-extrabold uppercase tracking-tight',
        3: 'text-2xl md:text-3xl font-bold uppercase',
        4: 'text-xl md:text-2xl font-bold',
        5: 'text-lg md:text-xl font-semibold',
        6: 'text-base md:text-lg font-semibold',
    };

    return (
        <Tag className={cn(levels[level], 'text-white', className)} {...props}>
            {children}
        </Tag>
    );
};
