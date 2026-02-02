'use client';

import React from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        brand: string;
        category: string;
        price: number;
        description: string;
        image: string;
        tags: string[];
    }
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart, isAdding } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            router.push('/login');
            return;
        }

        try {
            await addToCart(product._id);
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-slate-100 group"
        >
            <div className="relative aspect-square overflow-hidden bg-slate-50">
                <Link href={`/products/${product._id}`}>
                    <img
                        src={product.image || 'https://placehold.co/600x600?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </Link>
                <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold rounded-full shadow-sm">
                        {product.category}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">{product.brand}</p>
                        <Link href={`/products/${product._id}`}>
                            <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                                {product.name}
                            </h3>
                        </Link>
                    </div>
                    <p className="text-xl font-black text-primary">${product.price}</p>
                </div>

                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                    {product.description}
                </p>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-sm hover:shadow-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isAdding ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                <ShoppingCart size={18} />
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
