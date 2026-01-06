import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { MoreVertical } from 'lucide-react';

export const BestSellers = () => {
    const { orders } = useDashboard();

    // Calculate best sellers from real order data
    const getBestSellers = () => {
        const productSales: { [key: string]: { name: string; sales: number; revenue: number; image?: string; } } = {};

        orders.forEach((order: any) => {
            if (order.items) {
                order.items.forEach((item: any) => {
                    const product = item.productId;
                    const productName = product?.name || 'Unknown Product';
                    if (!productSales[productName]) {
                        productSales[productName] = {
                            name: productName,
                            sales: 0,
                            revenue: 0,
                            image: product?.images?.[0]
                        };
                    }
                    productSales[productName].sales += item.quantity || 1;
                    productSales[productName].revenue += (item.price || 0) * (item.quantity || 1);
                });
            }
        });

        return Object.values(productSales)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 3);
    };

    const bestSellers = getBestSellers();

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Best Sellers</h2>
                <button className="text-gray-400">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-6 flex-1">
                {bestSellers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No sales data available</p>
                    </div>
                ) : (
                    bestSellers.map((product, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-[#D1D5DB] rounded-lg overflow-hidden shrink-0">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : null}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 text-sm truncate">{product.name}</p>
                                    <p className="text-xs text-gray-400">₹{product.revenue.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="font-bold text-gray-900 text-sm">₹{product.revenue.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-400">{product.sales} sales</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50">
                <button className="w-auto px-6 py-2 bg-[#003B5C] text-white text-xs font-bold rounded-md hover:bg-[#002B44] transition-colors uppercase tracking-wider">
                    Report
                </button>
            </div>
        </div>
    );
};