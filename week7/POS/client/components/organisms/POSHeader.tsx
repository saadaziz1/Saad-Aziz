import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface POSHeaderProps {
    currentDate: string;
}

export const POSHeader: React.FC<POSHeaderProps> = ({ currentDate }) => {
    return (
        <div className="flex justify-between items-center shrink-0">
            <div>
                <h1 className="text-2xl font-semibold">Jaegar POS</h1>
                <p className="text-muted-foreground text-sm">{currentDate}</p>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    placeholder="Search for products, services, etc..."
                    maxLength={100}
                    className="pl-9 bg-[#2D303E] border-gray-700 text-white w-[220px] rounded-lg focus-visible:ring-primary"
                />
            </div>
        </div>
    );
};
