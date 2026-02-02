'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, SlidersHorizontal, Loader2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Navbar } from '@/components/layout/Navbar';
import { ProductCard } from '@/components/products/ProductCard';
import { GoogleLoader } from '@/components/ui/GoogleLoader';
import { useProducts } from '@/hooks/useProducts';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Vitamins', 'Bone Health', 'Heart Health', 'Hair & Skin', 'Minerals'];

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(''); // For normal live search
    const [aiQuery, setAiQuery] = useState(''); // For explicit AI search trigger
    const [isAiSearch, setIsAiSearch] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');

    // Debounce search query only for normal search
    useEffect(() => {
        if (!isAiSearch) {
            const timer = setTimeout(() => {
                setDebouncedQuery(searchQuery);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, isAiSearch]);

    // Clear AI query when switching modes to avoid stale results
    useEffect(() => {
        if (!isAiSearch) {
            setAiQuery('');
        }
    }, [isAiSearch]);

    const handleSearchTrigger = () => {
        if (isAiSearch && searchQuery.trim()) {
            setAiQuery(searchQuery);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchTrigger();
        }
    };

    // Use either AI query or debounced query depending on mode
    const finalQuery = isAiSearch ? aiQuery : debouncedQuery;

    const { products, explanation, isLoading, error } = useProducts(
        finalQuery || undefined,
        isAiSearch && !!finalQuery
    );

    // Filter products by category (client-side)
    const filteredProducts = useMemo(() => {
        if (activeCategory === 'All') return products;
        return products.filter(p => p.category === activeCategory);
    }, [products, activeCategory]);

    return (
        <main className="min-h-screen pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
            <Navbar />

            {/* Header Section */}
            <div className="mb-12 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
                >
                    Premium <span className="text-primary italic">Health</span> Solutions
                </motion.h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                    Discover scientifically-backed supplements and healthcare products tailored to your needs.
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="top-24 z-40 mb-12 flex flex-col gap-6">
                <div className="glass p-4 rounded-3xl shadow-xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                            {isAiSearch ? <Sparkles size={20} className="animate-pulse" /> : <Search size={20} />}
                        </div>
                        <input
                            type="text"
                            maxLength={150}
                            placeholder={isAiSearch ? "Try 'I have weak bones' or 'Supplements for heart' (Press Enter)..." : "Search products, brands..."}
                            className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        {isAiSearch && (
                            <button
                                onClick={handleSearchTrigger}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                                title="Search"
                            >
                                <Search size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setIsAiSearch(!isAiSearch)}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${isAiSearch ? 'bg-linear-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            <Sparkles size={18} />
                            AI Search
                        </button>
                        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-md">
                            <SlidersHorizontal size={18} />
                            Filters
                        </button>
                    </div>
                </div>

                {/* AI Explanation */}
                {explanation && isAiSearch && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative p-6 rounded-3xl bg-white border border-primary/20 shadow-lg shadow-primary/5 overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-primary to-secondary"></div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between text-primary font-bold text-sm tracking-wide uppercase">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} />
                                    <span>AI Recommendation</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setAiQuery('');
                                        setIsAiSearch(false);
                                    }}
                                    className="p-1 hover:bg-primary/10 rounded-full transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="text-slate-600 leading-relaxed text-[15px] [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_li]:mb-1 [&_strong]:font-bold [&_strong]:text-slate-800">
                                <ReactMarkdown>
                                    {explanation}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* AI Explanation Loading Skeleton */}
                {isLoading && isAiSearch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative p-6 rounded-3xl bg-white border border-primary/20 shadow-lg shadow-primary/5 overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-200"></div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-primary/40 animate-pulse" />
                                <div className="h-4 bg-slate-100 rounded animate-pulse w-32"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-slate-100 rounded animate-pulse w-full"></div>
                                <div className="h-4 bg-slate-100 rounded animate-pulse w-[92%]"></div>
                                <div className="h-4 bg-slate-100 rounded animate-pulse w-[85%]"></div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => setActiveCategory('All')}
                        className={`shadow-md px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === 'All' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                    >
                        All Products
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`shadow-md px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <GoogleLoader />
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-20">
                    <div className="bg-red-100 text-red-600 p-4 rounded-xl inline-block">
                        Failed to load products. Please try again.
                    </div>
                </div>
            )}

            {/* Product Grid */}
            {!isLoading && !error && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory + debouncedQuery}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}

            {!isLoading && !error && filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No products found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </main>
    );
}
