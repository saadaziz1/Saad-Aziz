import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: any;
    onClick: (product: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    const isOutOfStock = product.availability <= 0;
    const isLowStock = product.availability > 0 && product.availability <= 5;

    return (
        <Card
            onClick={() => !isOutOfStock && onClick(product)}
            className={cn(
                "bg-[#1F1D2B] border-none text-white p-6 flex flex-col items-center text-center pt-24 relative mt-12 transition-all group",
                isOutOfStock
                    ? "opacity-50 grayscale cursor-not-allowed"
                    : "hover:bg-[#252836] cursor-pointer active:scale-[0.98]"
            )}
        >
            <div className={cn(
                "absolute -top-12 w-32 h-32 rounded-full overflow-hidden border-4 border-[#252836] bg-gray-700 shadow-xl transition-transform",
                !isOutOfStock && "group-hover:scale-110"
            )}>
                {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                )}
            </div>
            <h3 className="font-semibold px-4 mb-2 min-h-12 line-clamp-2">{product.name}</h3>
            <p className={cn("text-lg font-bold mb-1", isOutOfStock ? "text-gray-500" : "text-primary")}>$ {product.price}</p>
            <p className={cn(
                "text-xs",
                isOutOfStock ? "text-red-500 font-medium" : isLowStock ? "text-[#FFB572] font-medium" : "text-gray-500"
            )}>
                {isOutOfStock ? "Out of Stock" : `${product.availability} Items available ${isLowStock ? "(Low Stock)" : ""}`}
            </p>
        </Card>
    );
};
