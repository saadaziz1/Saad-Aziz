"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { useProfile } from '@/hooks/useProfile';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { integralCF } from '@/styles/fonts';
import { checkoutSchema, CheckoutFormData } from '@/lib/validations/schemas';
import toast from 'react-hot-toast';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function CheckoutFormContent({ isStripeEnabled = false }: { isStripeEnabled?: boolean }) {
    const { cart, isLoading: isCartLoading, updateQuantity } = useCart();
    const { handleCheckout, isPlacing } = useOrders();
    const { profile } = useProfile();
    const router = useRouter();

    // Determine allowed payment methods based on cart content
    const hasMoneyOnly = cart?.items.some((i: any) => i.purchaseType === 'MONEY_ONLY');
    const hasPointsOnly = cart?.items.some((i: any) => i.purchaseType === 'POINTS_ONLY');
    // Hybrid can be either

    // Determine default payment method
    // If we have points only, default to points.
    // Else default to card.
    const defaultMethod = hasPointsOnly ? 'points' : 'card';

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormData>({
        resolver: yupResolver(checkoutSchema) as any,
        defaultValues: {
            email: profile?.email || '',
            firstName: profile?.name || '',
            address: profile?.address || '',
            city: '',
            postalCode: '',
            phone: profile?.phone || '',
            usePoints: 0,
            paymentMethod: defaultMethod,
            cardHolderName: '',
            cardNumber: '',
            expiryDate: '',
            cvv: '',
        },
    });

    const usePointsAsDiscount = watch('usePoints') || 0;
    const paymentMethod = watch('paymentMethod');

    const totalPrice = cart?.items.reduce((acc: number, item: any) => {
        if (item.purchaseType === 'POINTS_ONLY' || item.isPointsOnly) return acc;
        if ((item.purchaseType === 'HYBRID' || item.isHybrid) && paymentMethod === 'points') return acc;
        return acc + (item.price * item.quantity);
    }, 0) || 0;

    const totalDiscount = cart?.items.reduce((acc: number, item: any) => {
        if (item.purchaseType === 'POINTS_ONLY' || item.isPointsOnly) return acc;
        if ((item.purchaseType === 'HYBRID' || item.isHybrid) && paymentMethod === 'points') return acc;
        const discount = (item.price * (item.discount?.percentage || 0)) / 100;
        return acc + (discount * item.quantity);
    }, 0) || 0;

    const totalItemPoints = cart?.items.reduce((acc: number, item: any) => {
        if (item.purchaseType === 'MONEY_ONLY') return acc;
        if (item.purchaseType === 'POINTS_ONLY' || item.isPointsOnly) {
            return acc + ((item.pointsPrice || 0) * item.quantity);
        }
        if ((item.purchaseType === 'HYBRID' || item.isHybrid) && paymentMethod === 'points') {
            return acc + ((item.pointsPrice || 0) * item.quantity);
        }
        return acc;
    }, 0) || 0;

    const subtotal = totalPrice - totalDiscount;
    const discountFromPoints = paymentMethod === 'card' ? Math.min(usePointsAsDiscount, profile?.loyaltyPoints || 0, Math.floor(subtotal / 10)) : 0;
    const finalTotal = subtotal - (discountFromPoints * 10);

    const pointsNeededForFullPayment = cart?.items.reduce((acc: number, item: any) => {
        if (item.purchaseType === 'MONEY_ONLY') return acc;
        return acc + ((item.pointsPrice || 0) * item.quantity);
    }, 0) || 0;

    const canPayWithPoints = !hasMoneyOnly && (profile?.loyaltyPoints || 0) >= pointsNeededForFullPayment;

    useEffect(() => {
        setValue('usePoints', 0);
    }, [paymentMethod, setValue]);

    useEffect(() => {
        if (!cart?.items) return;

        const updateCartItems = async () => {
            const updates = [];
            for (const item of cart.items) {
                if (item.purchaseType === 'HYBRID' || item.isHybrid) {
                    const shouldBePoints = paymentMethod === 'points';
                    if (item.payWithPoints !== shouldBePoints) {
                        updates.push(updateQuantity(item.productId, item.quantity, item.selectedColor, item.selectedSize, shouldBePoints));
                    }
                } else if (item.purchaseType === 'POINTS_ONLY' || item.isPointsOnly) {
                    if (!item.payWithPoints) {
                        updates.push(updateQuantity(item.productId, item.quantity, item.selectedColor, item.selectedSize, true));
                    }
                } else if (item.purchaseType === 'MONEY_ONLY') {
                    if (item.payWithPoints) {
                        updates.push(updateQuantity(item.productId, item.quantity, item.selectedColor, item.selectedSize, false));
                    }
                }
            }
            if (updates.length > 0) {
                await Promise.all(updates);
            }
        };
        updateCartItems();
    }, [paymentMethod, cart?.items]);

    let pointsEarned = 0;
    if (subtotal > 0 && paymentMethod === 'card') {
        if (subtotal >= 500) pointsEarned = 30;
        else if (subtotal >= 200) pointsEarned = 20;
        else pointsEarned = 10;
    }

    const onStandardSubmit = async (data: CheckoutFormData) => {
        if (!cart?.items.length) {
            toast.error('Your cart is empty');
            return;
        }
        try {
            await handleCheckout(data);
            toast.success('Order placed successfully! 🎉');
            router.push('/shop');
        } catch (error: any) {
            console.error('Checkout failed:', error);
            const message = error.message || error.data?.message || 'Checkout failed';
            toast.error(message);
        }
    };

    if (isCartLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-pulse text-gray-400 font-medium">LOADING CHECKOUT...</div>
            </div>
        );
    }

    if (!cart?.items.length) {
        return (
            <div className="max-w-frame mx-auto px-4 py-12 text-center">
                <h1 className={cn(integralCF.className, "text-3xl mb-4")}>Your cart is empty</h1>
            </div>
        );
    }

    return (
        <div className="max-w-frame mx-auto px-4 py-8 md:py-12">
            <h1 className={cn(integralCF.className, "text-3xl md:text-4xl uppercase mb-8")}>
                CHECKOUT
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Checkout Form */}
                <div className="space-y-6">
                    <form id="checkout-form" className="space-y-6">
                        {/* Contact Information */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        placeholder="Email address"
                                        className={cn(
                                            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black",
                                            errors.email ? "border-red-500" : "border-gray-200"
                                        )}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        {...register('firstName')}
                                        type="text"
                                        placeholder="Full name"
                                        className={cn(
                                            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black",
                                            errors.firstName ? "border-red-500" : "border-gray-200"
                                        )}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <input
                                        {...register('address')}
                                        type="text"
                                        placeholder="Address"
                                        className={cn(
                                            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black",
                                            errors.address ? "border-red-500" : "border-gray-200"
                                        )}
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        {...register('city')}
                                        type="text"
                                        placeholder="City"
                                        className={cn(
                                            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black",
                                            errors.city ? "border-red-500" : "border-gray-200"
                                        )}
                                    />
                                    {errors.city && (
                                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        {...register('postalCode')}
                                        type="text"
                                        placeholder="Postal code"
                                        className={cn(
                                            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black",
                                            errors.postalCode ? "border-red-500" : "border-gray-200"
                                        )}
                                    />
                                    {errors.postalCode && (
                                        <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <input
                                        {...register('phone')}
                                        type="tel"
                                        placeholder="Phone number"
                                        className={cn(
                                            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black",
                                            errors.phone ? "border-red-500" : "border-gray-200"
                                        )}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                            <div className="space-y-4">
                                <label className={cn(
                                    "flex items-start space-x-3 p-4 rounded-xl border cursor-pointer transition-all",
                                    paymentMethod === 'card' ? "border-black bg-gray-50 ring-1 ring-black" : "border-gray-200 hover:bg-gray-50"
                                )}>
                                    <input
                                        {...register('paymentMethod')}
                                        type="radio"
                                        value="card"
                                        disabled={hasPointsOnly}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-sm">Credit / Debit Card</span>
                                            <div className="flex space-x-1">
                                                <div className="w-6 h-4 bg-blue-600 rounded" />
                                                <div className="w-6 h-4 bg-red-500 rounded" />
                                                <div className="w-6 h-4 bg-yellow-500 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                </label>

                                <label className={cn(
                                    "flex items-start space-x-3 p-4 rounded-xl border transition-all",
                                    !canPayWithPoints ? "opacity-50 cursor-not-allowed border-gray-100 bg-gray-50" :
                                        paymentMethod === 'points' ? "border-violet-600 bg-violet-50 ring-1 ring-violet-600 cursor-pointer" : "border-gray-200 hover:bg-gray-50 cursor-pointer"
                                )}>
                                    <input
                                        {...register('paymentMethod')}
                                        type="radio"
                                        value="points"
                                        disabled={!canPayWithPoints}
                                        className="mt-1 text-violet-600 focus:ring-violet-600"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-sm text-violet-900">Loyalty Points</span>
                                            <span className="text-xs font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                                                {profile?.loyaltyPoints || 0} Available
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Pay with {pointsNeededForFullPayment} points
                                        </p>
                                        {!canPayWithPoints && subtotal > 0 && (
                                            <p className="text-[10px] text-red-500 mt-1">Insufficient points for full payment</p>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Stripe Payment Element (Only if paying with card AND Stripe enabled) */}
                        {paymentMethod === 'card' && isStripeEnabled && (
                            <div className="bg-white border border-gray-100 rounded-2xl p-6">
                                <h2 className="text-xl font-bold mb-4">Card Details</h2>
                                <PaymentElement />
                            </div>
                        )}
                        {/* Fallback for Card enabled but Stripe not ready? Should be handled by parent state (loading) */}
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:sticky lg:top-8 h-fit">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                        {/* Items */}
                        <div className="space-y-4 mb-6">
                            {cart.items.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.title}</h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        {item.selectedColor && (
                                            <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>
                                        )}
                                        {item.selectedSize && (
                                            <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                                        )}
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        {(item.payWithPoints || item.isPointsOnly || item.purchaseType === 'POINTS_ONLY' || ((item.purchaseType === 'HYBRID' || item.isHybrid) && paymentMethod === 'points')) ? (
                                            <>
                                                <p className="font-semibold text-violet-600">{(item.pointsPrice * item.quantity).toLocaleString()} pts</p>
                                                <p className="text-[10px] text-violet-400 font-bold uppercase">Points Payment</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                                {item.discount?.percentage > 0 && (
                                                    <p className="text-sm text-red-600">-{item.discount.percentage}%</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="border-t border-gray-100 pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            {totalDiscount > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Discount</span>
                                    <span>-${totalDiscount.toFixed(2)}</span>
                                </div>
                            )}
                            {totalItemPoints > 0 && (
                                <div className="flex justify-between text-violet-600 font-bold">
                                    <span>Points for Items</span>
                                    <span>{totalItemPoints.toLocaleString()} pts</span>
                                </div>
                            )}
                            {discountFromPoints > 0 && (
                                <div className="flex justify-between text-violet-500 italic">
                                    <span>Global Discount ({discountFromPoints} pts)</span>
                                    <span>-${(discountFromPoints * 10).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-2">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>

                            {pointsEarned > 0 && (
                                <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[11px] font-bold text-green-700 uppercase">Points You'll Earn</span>
                                    </div>
                                    <span className="text-sm font-black text-green-700">+{pointsEarned} pts</span>
                                </div>
                            )}
                        </div>

                        {isStripeEnabled ? (
                            <StripeSubmitButton
                                finalTotal={finalTotal}
                                isPlacing={isPlacing}
                                handleSubmit={handleSubmit}
                                onStandardSubmit={onStandardSubmit}
                                paymentMethod={paymentMethod}
                                router={router}
                                handleCheckout={handleCheckout}
                            />
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit(onStandardSubmit)}
                                disabled={isPlacing}
                                className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 mt-6"
                            >
                                {isPlacing ? 'Processing Order...' : `Complete Order - $${finalTotal.toFixed(2)}`}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Inner Component to safely use Stripe hooks
function StripeSubmitButton({ finalTotal, isPlacing, handleSubmit, onStandardSubmit, paymentMethod, router, handleCheckout }: any) {
    const stripe = useStripe();
    const elements = useElements();
    const [isStripeProcessing, setIsStripeProcessing] = useState(false);

    const onStripeSubmit = async (data: CheckoutFormData) => {
        if (paymentMethod !== 'card') {
            // Fallback to standard submit if method switched but component still mounted (rare but safe)
            return onStandardSubmit(data);
        }

        if (!stripe || !elements) {
            toast.error("Stripe not loaded");
            return;
        }
        setIsStripeProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
            confirmParams: {
                return_url: window.location.origin + '/checkout/success',
                payment_method_data: {
                    billing_details: {
                        name: data.cardHolderName || data.firstName,
                        email: data.email,
                        phone: data.phone,
                        address: {
                            line1: data.address,
                            city: data.city,
                            postal_code: data.postalCode,
                        }
                    }
                }
            },
        });

        if (error) {
            console.error("Stripe confirmPayment error:", JSON.stringify(error, null, 2));
            toast.error(error.message || "Payment failed");
            setIsStripeProcessing(false);
            return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
            const orderPayload = {
                ...data,
                paymentIntentId: paymentIntent.id
            };
            try {
                await handleCheckout(orderPayload);
                toast.success('Order placed successfully! 🎉');
                router.push('/shop');
            } catch (err: any) {
                toast.error(err.message || 'Order verification failed');
                setIsStripeProcessing(false);
            }
        } else {
            setIsStripeProcessing(false);
        }
    };

    const isProcessing = isPlacing || isStripeProcessing;

    return (
        <button
            type="button"
            onClick={() => {
                const onError = (errors: any) => {
                    console.error("Form Validation Errors:", errors);
                    toast.error("Please check the form for errors");
                };

                if (paymentMethod === 'card') {
                    handleSubmit(onStripeSubmit, onError)();
                } else {
                    handleSubmit(onStandardSubmit, onError)();
                }
            }}
            disabled={isProcessing || !stripe}
            className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 mt-6"
        >
            {isProcessing ? 'Processing Order...' : `Complete Order - $${finalTotal.toFixed(2)}`}
        </button>
    );
}
