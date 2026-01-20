import React, { useState } from 'react';
import { SlidersHorizontal, Plus, Edit2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { CategoryManagementDialog } from './CategoryManagementDialog';
import { useGetCategoriesQuery } from '@/libreduxservices/categoryApi';

import { CategoryTabs } from './CategoryTabs';

interface ProductManagementProps {
    products: any[];
    isLoading: boolean;
    activeCategory: string;
    onCategoryChange: (cat: string) => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = (props) => {
    const { products, isLoading, activeCategory, onCategoryChange } = props;
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const { data: categories } = useGetCategoriesQuery();

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h2 className="text-xl font-semibold">Products Management</h2>
                <Button
                    variant="outline"
                    className="border-gray-600 text-white gap-2"
                    onClick={() => setCategoryDialogOpen(true)}
                >
                    <SlidersHorizontal size={16} />
                    Manage Categories
                </Button>
            </div>

            <Tabs value={activeCategory} onValueChange={onCategoryChange} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <CategoryTabs categories={categories || []} />

                <div className="flex-1 overflow-y-auto mt-0 pr-2 no-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-6 pb-10">
                            <Link href="/settings/products/add" className="contents">
                                <div className="border-2 border-dashed border-[#ea7c69] bg-[#1F1D2B] rounded-xl min-h-[300px] flex flex-col items-center justify-center text-[#ea7c69] cursor-pointer hover:bg-[#ea7c69]/10 transition-colors gap-4">
                                    <Plus className="w-10 h-10" />
                                    <span className="font-semibold text-lg">Add new dish</span>
                                </div>
                            </Link>

                            {products?.map((product: any) => {
                                const isInactive = product.isActive === false;
                                const isOutOfStock = product.availability <= 0;
                                const isLowStock = product.availability > 0 && product.availability <= 5;

                                return (
                                    <div key={product._id} className="bg-[#1F1D2B] border border-[#2d303e] rounded-xl flex flex-col items-center text-center p-0 hover:border-[#ea7c69]/50 transition-all">
                                        <div className="pt-8 pb-4 w-full flex justify-center">
                                            <div className="w-36 h-36 rounded-full overflow-hidden">
                                                {product.image ? (
                                                    <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                                                ) : (
                                                    <div className="w-full h-full bg-[#252836] flex items-center justify-center text-gray-500">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Badges */}
                                        <div className="flex gap-2 mb-3 flex-wrap justify-center px-4">
                                            {isInactive && (
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-600/30 text-gray-400 border border-gray-600">
                                                    Inactive
                                                </span>
                                            )}
                                            {isOutOfStock && (
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-500 border border-red-500">
                                                    Out of Stock
                                                </span>
                                            )}
                                            {isLowStock && !isOutOfStock && (
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#FFB572]/20 text-[#FFB572] border border-[#FFB572]">
                                                    Low Stock
                                                </span>
                                            )}
                                        </div>

                                        <div className="px-6 flex-1 flex flex-col items-center w-full">
                                            <h3 className="font-medium text-white text-lg mb-2 line-clamp-2">{product.name}</h3>
                                            <div className="text-gray-400 mb-6 font-medium truncate max-w-full px-2" title={`$ ${product.price} • ${product.availability} Bowls`}>
                                                $ {product.price} • {product.availability} Bowls
                                            </div>
                                        </div>

                                        <div className="w-full px-6 pb-8">
                                            <Link href={`/settings/products/edit/${product._id}`} className="w-full block">
                                                <Button className="w-full bg-[#ea7c69]/20 text-[#ea7c69] hover:bg-[#ea7c69]/30 border-none h-12 font-semibold text-sm rounded-lg">
                                                    <Edit2 className="w-4 h-4 mr-2" /> Edit dish
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Tabs>

            <CategoryManagementDialog
                open={categoryDialogOpen}
                onOpenChange={setCategoryDialogOpen}
            />
        </div>
    );
};
