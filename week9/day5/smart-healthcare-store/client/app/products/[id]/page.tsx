'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SingleProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { product, isLoading, error } = useProduct(id);
    const { addToCart, isAdding } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const handleAddToCart = async () => {
        if (!product) return;
        try {
            await addToCart(product._id, quantity);
            toast.success(`${product.name} added to cart!`);
        } catch (err) {
            toast.error('Failed to add to cart');
        }
    };

    // Use only backend image
    const images = product && product.image ? [product.image] : [];

    if (isLoading) {
        return (
            <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-slate-50/50">
                <Navbar />
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-slate-50/50">
                <Navbar />
                <div className="max-w-7xl mx-auto text-center py-20">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h1>
                    <Link href="/products" className="text-primary font-medium hover:underline">
                        ← Back to Products
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-slate-50/50">
            <Navbar />

            <div className="max-w-7xl mx-auto">
                <Link href="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-medium">
                    <ArrowLeft size={20} />
                    Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Gallery Section */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-square bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 relative group"
                        >
                            <img
                                src={images[activeImage] || 'https://placehold.co/600x600?text=No+Image'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Only show thumbnails if multiple images exist */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-slate-200'}`}
                                    >
                                        <img src={img} alt="Product view" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                    {product.category}
                                </span>
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-slate-700 font-bold text-sm">4.8</span>
                                    <span className="text-slate-400 text-sm">(120 reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-medium text-slate-500">
                                {product.brand}
                            </p>
                        </div>

                        <div className="flex items-end gap-4 pb-8 border-b border-slate-200">
                            <span className="text-5xl font-black text-primary">${product.price}</span>
                        </div>

                        <div className="prose prose-slate text-slate-600 leading-relaxed">
                            <p>{product.description}</p>
                            <ul className="space-y-2 mt-4">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                    Premium quality ingredients
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                    Certified organic & non-GMO
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                    30-day money-back guarantee
                                </li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-4">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm h-14">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors font-bold text-lg"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-bold text-slate-900 w-6 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors font-bold text-lg"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding}
                                    className="flex-1 h-14 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isAdding ? (
                                        <Loader2 size={22} className="animate-spin" />
                                    ) : (
                                        <>
                                            <ShoppingCart size={22} />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-8">
                            {[
                                { icon: <ShieldCheck className="text-primary" />, title: "Secure Payment" },
                                { icon: <Truck className="text-primary" />, title: "Free Shipping" },
                                { icon: <RotateCcw className="text-primary" />, title: "Free Returns" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                    {item.icon}
                                    <span className="text-xs font-bold text-slate-700">{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
