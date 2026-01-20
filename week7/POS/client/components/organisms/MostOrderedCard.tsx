import React from 'react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MostOrderedItem {
    name: string;
    totalQty: number;
    image: string;
}

interface MostOrderedCardProps {
    items: MostOrderedItem[];
}

export const MostOrderedCard: React.FC<MostOrderedCardProps> = ({ items }) => {
    return (
        <Card className="bg-[#1F1D2B] border-none text-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-xl">Most Ordered</h3>
                <Select defaultValue="today">
                    <SelectTrigger className="w-[100px] bg-transparent border-[#393C49] text-white h-9 rounded-lg">
                        <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1F1D2B] border-[#393C49] text-white">
                        <SelectItem value="today">Today</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-6">
                {items.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex gap-4 items-center border-b border-[#393C49] pb-4 last:border-0 last:pb-0">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-full object-cover shrink-0 bg-[#252836]"
                        />
                        <div>
                            <p className="font-medium text-sm text-white line-clamp-2 leading-tight mb-1">{item.name}</p>
                            <p className="text-xs text-[#ABBBC2]">{item.totalQty} dishes ordered</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-3 border border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition-colors">
                View All
            </button>
        </Card>
    );
};
