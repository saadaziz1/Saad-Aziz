"use client";

import React from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Order } from '@/types/user.types';
import { cn } from '@/lib/utils';
import { integralCF } from '@/styles/fonts';

export const OrderHistory = () => {
    const { orders, isLoadingOrders } = useProfile();

    if (isLoadingOrders) {
        return (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-gray-100 rounded-xl p-4 md:p-6">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                    <div className="space-y-2">
                                        <div className="h-5 bg-gray-200 rounded w-32"></div>
                                        <div className="h-4 bg-gray-100 rounded w-24"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                                        <div className="h-5 bg-gray-100 rounded w-16"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
            <h2 className={cn(integralCF.className, "text-xl md:text-2xl uppercase mb-6")}>Order History</h2>
            
            {orders.length === 0 ? (
                <div className="text-center py-12 md:py-16">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                        <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 text-sm md:text-base mb-6">Start shopping to see your orders here!</p>
                    <a href="/shop" className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all">
                        Start Shopping
                    </a>
                </div>
            ) : (
                <div className="space-y-4 md:space-y-6">
                    {orders.map((order: Order) => (
                        <div key={order._id} className="border border-gray-100 rounded-xl p-4 md:p-6 hover:bg-gray-50/50 transition-all">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-base md:text-lg">Order #{order._id.slice(-8).toUpperCase()}</h3>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="flex flex-row md:flex-col md:text-right gap-3 md:gap-1">
                                    <div>
                                        <p className="font-bold text-lg md:text-xl">${order.totalAmount?.toFixed(2)}</p>
                                        {order.pointsUsed > 0 && (
                                            <p className="text-xs md:text-sm text-blue-600 font-medium">{order.pointsUsed} points used</p>
                                        )}
                                    </div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                        order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-100' :
                                        order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                        order.status === 'paid' ? 'bg-green-50 text-green-700 border border-green-100' :
                                        order.status === 'processing' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                        'bg-gray-50 text-gray-700 border border-gray-100'
                                    }`}>
                                        {order.status === 'paid' ? 'Confirmed' : order.status}
                                    </span>
                                </div>
                            </div>
                            
                            {order.items && order.items.length > 0 && (
                                <div className="border-t border-gray-100 pt-4">
                                    <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Items Ordered</h4>
                                    <div className="space-y-3">
                                        {order.items.map((item, index: number) => (
                                            <div key={index} className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 text-sm md:text-base">
                                                        {item.productId?.name || 'Product'}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                                        {item.selectedColor && (
                                                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.selectedColor}</span>
                                                        )}
                                                        {item.selectedSize && (
                                                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.selectedSize}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm md:text-base">
                                                        {item.paidWithPoints ? 
                                                            `${item.price * item.quantity} pts` : 
                                                            `$${(item.price * item.quantity).toFixed(2)}`
                                                        }
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        ${item.price.toFixed(2)} each
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};