'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, HeartPulse, Menu, X, Home, Package, Phone } from 'lucide-react';
import { CartSheet } from '@/components/cart/CartSheet';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const { itemCount } = useCart();
    const router = useRouter();

    const handleOpenCart = () => {
        if (!isAuthenticated) {
            toast.error('Please login to view cart');
            router.push('/login');
            return;
        }
        setIsCartOpen(true);
    };

    return (
        <>
            <nav className="fixed top-4 left-4 right-4 z-50 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg supports-backdrop-filter:bg-white/60">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group z-50 relative">
                        <div className="p-2 bg-primary rounded-lg text-white group-hover:rotate-12 transition-transform duration-300">
                            <HeartPulse size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                            SmartHealth
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link href="/" className="hover:text-primary transition-colors duration-200">Home</Link>
                        <Link href="/products" className="hover:text-primary transition-colors duration-200">Products</Link>
                        <Link href="#" className="hover:text-primary transition-colors duration-200">Categories</Link>
                        <Link href="#" className="hover:text-primary transition-colors duration-200">Support</Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 z-50 relative">
                        <button
                            onClick={handleOpenCart}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200 relative group"
                        >
                            <ShoppingCart size={20} className="text-slate-600 group-hover:text-primary transition-colors" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-[10px] flex items-center justify-center text-white rounded-full border-2 border-white animate-in zoom-in">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {isAuthenticated ? (
                            <div className="hidden md:flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                                    <div className="p-1 bg-white rounded-full shadow-sm">
                                        <User size={14} className="text-primary" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">User</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-slate-500 hover:text-red-500 font-bold text-sm transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                                <User size={18} />
                                <span className="text-sm font-semibold">Login</span>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Cart Drawer */}
            <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-6 text-lg font-bold text-slate-800">
                            <Link href="/" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50" onClick={() => setIsMobileMenuOpen(false)}>
                                <Home size={24} className="text-primary" />
                                Home
                            </Link>
                            <Link href="/products" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50" onClick={() => setIsMobileMenuOpen(false)}>
                                <Package size={24} className="text-primary" />
                                Products
                            </Link>
                            <Link href="#" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50" onClick={() => setIsMobileMenuOpen(false)}>
                                <Phone size={24} className="text-primary" />
                                Support
                            </Link>
                            <hr className="border-slate-100" />
                            <Link href="/login" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                                <User size={24} />
                                Login / Sign Up
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
