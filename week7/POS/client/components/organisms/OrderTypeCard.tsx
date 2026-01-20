import React from 'react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface OrderTypeData {
    name: string;
    value: number;
    color: string;
    [key: string]: any;
}

interface OrderTypeCardProps {
    data: OrderTypeData[];
}

export const OrderTypeCard: React.FC<OrderTypeCardProps> = ({ data }) => {
    return (
        <Card className="bg-[#1F1D2B] border-none text-white p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold">Most Type of Order</h3>
                <Select defaultValue="today">
                    <SelectTrigger className="w-[100px] bg-transparent border-gray-700 text-white h-8">
                        <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1F1D2B] border-gray-700 text-white">
                        <SelectItem value="today">Today</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[250px]">
                <div className="w-56 h-56 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={65}
                                outerRadius={85}
                                paddingAngle={8}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="w-full mt-6 flex flex-col gap-3">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-[#252836] p-2 rounded-lg">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <div className="flex-1 text-sm font-medium">{item.name}</div>
                            <div className="text-xs text-gray-400">{item.value} customers</div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
