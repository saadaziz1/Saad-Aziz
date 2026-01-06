"use client";

import React from 'react';
import { DashboardLayout } from '@/components/dashboard-page/DashboardLayout';
import { ProductCard } from '@/components/dashboard-page/ProductCard';
import { useGetProductsQuery } from '@/api/productsApi';
import { useProductsStore } from '@/store/useProductsStore';
import { Plus, ChevronLeft, ChevronRight, Loader2, PackagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AllProductsPage() {
    const { page, limit, setPage, search, category, type, setSearch, setCategory, setType } = useProductsStore();

    const { data, isLoading, isFetching } = useGetProductsQuery({
        page,
        limit,
        search: search || undefined,
        category: category || undefined,
        type: type || undefined,
    });

    const products = data?.products || [];
    const totalPages = data?.pages || 0;

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            // Simple pagination: show first, current, last, and ellipses if necessary
            if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
                pages.push(i);
            } else if (i === page - 2 || i === page + 2) {
                pages.push('...');
            }
        }

        const uniquePages = Array.from(new Set(pages));

        return (
            <div className="flex items-center space-x-2 mt-10">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg disabled:opacity-50 text-gray-500"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {uniquePages.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => typeof p === 'number' && setPage(p)}
                        disabled={p === '...'}
                        className={cn(
                            "w-10 h-10 flex items-center justify-center rounded-lg text-xs font-bold transition-all",
                            p === page
                                ? "bg-[#003B5C] text-white shadow-md"
                                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                        )}
                    >
                        {p}
                    </button>
                ))}

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg disabled:opacity-50 text-gray-500"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center ml-4 bg-white border border-gray-200 rounded-lg px-3 py-2 text-[11px] font-bold text-gray-600">
                    NEXT <ChevronRight className="w-3 h-3 ml-1" />
                </div>
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                        <span>Home</span>
                        <ChevronRight className="w-3 h-3 mx-1" />
                        <span className="text-gray-600">All Products</span>
                    </div>
                </div>

                <Link href="/dashboard/products/new" className="flex items-center bg-[#000000] text-white px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md">
                    <PackagePlus className="w-4 h-4 mr-2" />
                    Add New Product
                </Link>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-12 h-12 text-[#003B5C] animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Loading products...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Plus className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                    <p className="text-gray-500 text-center max-w-xs mb-8">
                        We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                    </p>
                    <button
                        onClick={() => {
                            useProductsStore.getState().setSearch('');
                            useProductsStore.getState().setCategory('');
                        }}
                        className="text-[#003B5C] font-bold text-sm underline underline-offset-4"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <>
                    <div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 transition-opacity duration-300", isFetching && "opacity-60")}>
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {renderPagination()}
                </>
            )}
        </DashboardLayout>
    );
}
