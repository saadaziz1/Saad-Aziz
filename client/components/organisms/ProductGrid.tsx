import React from 'react';
import { Loader2 } from "lucide-react";
import { ProductCard } from "../molecules/ProductCard";

interface ProductGridProps {
    products: any[];
    isLoading: boolean;
    addToCart: (product: any) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading, addToCart }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p>No products found in this category.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    onClick={addToCart}
                />
            ))}
        </div>
    );
};
