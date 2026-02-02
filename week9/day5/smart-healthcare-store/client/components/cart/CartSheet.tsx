'use client';

import React from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';

interface CartSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CartSheet = ({ isOpen, onClose }: CartSheetProps) => {
    const {
        items,
        total,
        isLoading,
        isUpdating,
        isRemoving,
        updateQuantity,
        removeFromCart
    } = useCart();

    const handleUpdateQuantity = async (productId: string, currentQty: number, delta: number) => {
        const newQty = currentQty + delta;
        if (newQty <= 0) {
            await removeFromCart(productId);
        } else {
            await updateQuantity(productId, newQty);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-101 flex flex-col border-l border-slate-100"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                    <ShoppingBag size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Your Cart <span className="text-sm font-medium text-slate-400 ml-1">({items.length})</span>
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex-1 flex items-center justify-center">
                                <Loader2 className="animate-spin text-primary" size={32} />
                            </div>
                        )}

                        {/* Items */}
                        {!isLoading && (
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {items.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                                        <ShoppingBag size={48} className="text-slate-300" />
                                        <p className="font-medium text-slate-600">Your cart is empty</p>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <motion.div
                                            layout
                                            key={item.productId}
                                            className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-primary/20 transition-colors"
                                        >
                                            <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                                <img
                                                    src={item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                                                            <p className="text-xs text-slate-400">${item.price.toFixed(2)} each</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.productId)}
                                                            disabled={isRemoving}
                                                            className="text-slate-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                                                            disabled={isUpdating}
                                                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-50"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="text-sm font-bold text-slate-900 w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                                                            disabled={isUpdating}
                                                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-50"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <p className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Footer */}
                        {!isLoading && items.length > 0 && (
                            <div className="p-6 border-t border-slate-100 bg-slate-50">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-slate-900">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                                        <span>Total</span>
                                        <span className="text-primary">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                                    Checkout Now
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
