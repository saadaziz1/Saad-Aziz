'use client';

import React from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

interface MiniProductCardProps {
    product: {
        _id: string;
        name: string;
        brand?: string;
        category?: string;
        price: number;
        description?: string;
        image?: string;
    };
}

/**
 * Compact product card for use in chat and other tight spaces.
 * Shows image, name, price with link to product page.
 */
export const MiniProductCard = ({ product }: MiniProductCardProps) => {
    const { addToCart, isAdding } = useCart();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await addToCart(product._id);
            toast.success(`Added to cart!`);
        } catch (error) {
            toast.error('Failed to add');
        }
    };

    const defaultImage = 'https://placehold.co/200x200?text=No+Image';

    return (
        <Link href={`/products/${product._id}`}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer group"
            >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                    <img
                        src={product.image || defaultImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 font-medium truncate">
                        {product.brand || product.category || 'Healthcare'}
                    </p>
                    <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-primary transition-colors">
                        {product.name}
                    </h4>
                    <p className="text-sm font-black text-primary">${product.price}</p>
                </div>

                {/* Quick Add Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="p-2 bg-slate-900 text-white rounded-lg hover:bg-primary transition-colors shrink-0 disabled:opacity-50"
                    title="Add to cart"
                >
                    {isAdding ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <ShoppingCart size={14} />
                    )}
                </button>
            </motion.div>
        </Link>
    );
};
