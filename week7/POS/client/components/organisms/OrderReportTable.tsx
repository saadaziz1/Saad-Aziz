import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings } from "lucide-react";

interface Order {
    customer: string;
    avatar: string;
    menu: string;
    payment: string;
    status: string;
}

interface OrderReportTableProps {
    orders: Order[];
}

export const OrderReportTable: React.FC<OrderReportTableProps> = ({ orders }) => {
    return (
        <Card className="bg-[#1F1D2B] border-none text-white flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Order Report</h3>
                <div className="flex items-center gap-2 border border-[#393C49] rounded-lg px-3 py-2 text-sm text-[#ABBBC2] cursor-pointer hover:bg-white/5 transition-colors">
                    <Settings size={18} />
                    <span>Filter Order</span>
                </div>
            </div>

            <div className="overflow-auto max-h-[400px] custom-scrollbar">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#393C49] hover:bg-transparent">
                            <TableHead className="text-white font-semibold">Customer</TableHead>
                            <TableHead className="text-white font-semibold">Menu</TableHead>
                            <TableHead className="text-white font-semibold">Total Payment</TableHead>
                            <TableHead className="text-white font-semibold">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order, i) => (
                                <TableRow key={i} className="border-b border-[#393C49] hover:bg-[#252836]/50">
                                    <TableCell className="font-medium flex items-center gap-3 text-[#E0E6E9]">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2D303E]">
                                            <img src={order.avatar} alt={order.customer} className="w-full h-full object-cover" />
                                        </div>
                                        {order.customer}
                                    </TableCell>
                                    <TableCell className="text-[#ABBBC2]">{order.menu}</TableCell>
                                    <TableCell className="text-[#E0E6E9]">{order.payment}</TableCell>
                                    <TableCell>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium
                      ${order.status === 'Completed' ? 'bg-[#50D1AA]/20 text-[#50D1AA]' :
                                                order.status === 'Preparing' ? 'bg-[#9290FE]/20 text-[#9290FE]' :
                                                    'bg-[#FFB572]/20 text-[#FFB572]'}`}>
                                            {order.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-[#ABBBC2]">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
};
