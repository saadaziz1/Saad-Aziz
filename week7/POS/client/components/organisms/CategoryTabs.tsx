import React, { useRef, useState, useEffect } from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from '@/libreduxservices/categoryApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryTabsProps {
    categories: Category[];
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 1
        );
    };

    useEffect(() => {
        checkScroll();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
            return () => {
                container.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, [categories]);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = 200;
        const newScrollLeft = direction === 'left'
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;

        container.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    };

    return (
        <div className="relative flex items-center gap-2 mb-6">
            {canScrollLeft && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => scroll('left')}
                    className="absolute left-0 z-10 bg-[#1F1D2B]/90 hover:bg-[#252836] text-white h-8 w-8 rounded-full shadow-lg"
                >
                    <ChevronLeft size={20} />
                </Button>
            )}

            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-x-auto no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <TabsList className="bg-transparent justify-start gap-8 border-b border-gray-700 rounded-none h-auto p-0 pb-0 shrink-0 inline-flex min-w-full">
                    {categories.map(cat => (
                        <TabsTrigger
                            key={cat._id}
                            value={cat.name}
                            title={cat.name}
                            className="data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 text-gray-400 font-medium transition-all whitespace-nowrap max-w-[150px] truncate"
                        >
                            {cat.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            {canScrollRight && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => scroll('right')}
                    className="absolute right-0 z-10 bg-[#1F1D2B]/90 hover:bg-[#252836] text-white h-8 w-8 rounded-full shadow-lg"
                >
                    <ChevronRight size={20} />
                </Button>
            )}
        </div>
    );
};
