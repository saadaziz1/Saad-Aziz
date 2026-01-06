"use client";

import React from 'react';
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

export default function CheckoutPage() {
    const { cart, isLoading, updateQuantity } = useCart();
    const { handleCheckout, isPlacing } = useOrders();
    const { profile } = useProfile();
    const router = useRouter();

    // Determine allowed payment methods based on cart content
    // We strictly default if cart exists. If cart is loading or null, defaults are safe (undefined checks)
    const hasMoneyOnly = cart?.items.some((i: any) => i.purchaseType === 'MONEY_ONLY');
    const hasPointsOnly = cart?.items.some((i: any) => i.purchaseType === 'POINTS_ONLY');
    const hasHybrid = cart?.items.some((i: any) => i.purchaseType === 'HYBRID');

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
            paymentMethod: hasPointsOnly ? 'points' : 'card',
            cardHolderName: '',
            cardNumber: '',
            expiryDate: '',
            cvv: '',
        },
    });

    const usePointsAsDiscount = watch('usePoints') || 0;
    const paymentMethod = watch('paymentMethod');

    // Calculate totals based on global payment method selection
    // If 'points' is selected, Hybrid items are paid with points.
    // If 'card' is selected, Hybrid items are paid with money.
    const totalPrice = cart?.items.reduce((acc: number, item: any) => {
        // Items that MUST be paid with points
        if (item.purchaseType === 'POINTS_ONLY' || item.isPointsOnly) return acc;

        // Hybrid items: if global method is points, we don't pay money
        if ((item.purchaseType === 'HYBRID' || item.isHybrid) && paymentMethod === 'points') return acc;

        return acc + (item.price * item.quantity);
    }, 0) || 0;

    const totalDiscount = cart?.items.reduce((acc: number, item: any) => {
        if (item.purchaseType === 'POINTS_ONLY' || item.isPointsOnly) return acc;
        if ((item.purchaseType === 'HYBRID' || item.isHybrid) && paymentMethod === 'points') return acc;

        const discount = (item.price * (item.discount?.percentage || 0)) / 100;
        return acc + (discount * item.quantity);
    }, 0) || 0;

    // Total points required
    const totalItemPoints = cart?.items.reduce((acc: number, item: any) => {
        // If money only, no points
        if (item.purchaseType === 'MONEY_ONLY') return acc;

        // If points only, always add points
        if (item.purchaseType === 'POINTS_ONLY' || item.isPointsOnly) {
            return acc + ((item.pointsPrice || 0) * item.quantity);
        }

        // If hybrid, only add points if global method is points
        if ((item.purchaseType === 'HYBRID' || item.isHybrid) && paymentMethod === 'points') {
            return acc + ((item.pointsPrice || 0) * item.quantity);
        }

        return acc;
    }, 0) || 0;

    const subtotal = totalPrice - totalDiscount;
    // We only apply global points discount if we are paying with CARD (i.e. partial points use)
    // But logic says "disable points method for money only". 
    // And "points method" here seems to mean "Full Points Payment".
    // So 'usePointsAsDiscount' might be redundant or conflicting if we just use 'paymentMethod=points' for full payment.
    // Let's assume if paymentMethod=points, we pay 0 money, so discountFromPoints is irrelevant/0.
    const discountFromPoints = paymentMethod === 'card' ? Math.min(usePointsAsDiscount, profile?.loyaltyPoints || 0, Math.floor(subtotal / 10)) : 0;
    const finalTotal = subtotal - (discountFromPoints * 10);

    // Calculate the total points needed if the user chooses 'Loyalty Points' payment method
    // This includes Points Only items AND Hybrid items (since selecting points method implies paying points for them)
    const pointsNeededForFullPayment = cart?.items.reduce((acc: number, item: any) => {
        if (item.purchaseType === 'MONEY_ONLY') return acc;
        return acc + ((item.pointsPrice || 0) * item.quantity);
    }, 0) || 0;

    // Can pay with points:
    // If we have Money Only items -> NO.
    // If user has enough points for the calculated Point Cost -> YES.
    const canPayWithPoints = !hasMoneyOnly && (profile?.loyaltyPoints || 0) >= pointsNeededForFullPayment;

    // React to payment method change manually if needed, but watch handles state. 
    // Effect to sync usePoints with paymentMethod
    React.useEffect(() => {
        // If we switch to 'points', we are paying fully in points (for compatible items). 
        // We set usePoints to 0 because we aren't "using points for monetary discount", we are "using purchase points".
        // Actually, schema requires usePoints. We can just set it to 0.
        // Or if we want to support "Mixed" Global Discount, that's complex. Let's stick to the strict requested logic.
        setValue('usePoints', 0);
    }, [paymentMethod, setValue]);


    // Calculate points to be earned (Display only, backend re-calculates)
    let pointsEarned = 0;
    if (subtotal > 0 && paymentMethod === 'card') {
        if (subtotal >= 500) pointsEarned = 30;
        else if (subtotal >= 200) pointsEarned = 20;
        else pointsEarned = 10;
    }

    const onSubmit = async (data: CheckoutFormData) => {
        console.log('Checkout form data:', data);
        console.log('Cart items:', cart?.items);
        console.log('Points to use:', usePointsAsDiscount);
        console.log('Final total:', finalTotal);
        console.log('Final Points Cost:', totalItemPoints);

        if (!cart?.items.length) {
            toast.error('Your cart is empty');
            return;
        }

        try {
            console.log('Submitting checkout...');
            // Need to ensure backend knows which items are paid with points.
            // Since we removed individual toggles, we assume backend logic or we update cart before checkout?
            // Or we just rely on `paymentMethod` field? CheckoutFormData doesn't have `paymentMethod` mapped to cart items.
            // IMPORTANT: The backend `handleCheckout` (ordersApi) usually takes just address/payment details, 
            // and uses the CURRENT CART state.
            // If we are strictly using UI to toggle cost, we MUST update the cart items' `payWithPoints` status on the backend 
            // to match the user's selection BEFORE placing order?
            // OR we pass `paymentMethod` to `placeOrder` and backend handles it?
            // Checking `useOrders`: `handleCheckout` calls `placeOrder(data)`.
            // `ordersApi.placeOrder` sends `data`.
            // Backend `OrdersService.create` reads cart items.
            // Cart items have `payWithPoints` flag.
            // PROBLEM: We are changing the VISUAL `payWithPoints` logic (via `paymentMethod` radio) but NOT updating the underlying cart items if we removed the checkbox.
            // SOLUTION: We should iterate over cart items and call `updateQuantity` (which calls `updateItem`) to set `payWithPoints` 
            // when the user toggles the global radio? 
            // Or simpler: We keep the visual calculation here, but we need to ensure the `payWithPoints` flag on the items is correct before submission.
            // Wait, making multiple API calls to update cart on radio toggle is slow/risky.
            // Better: Pass `paymentMethod` or `payWithPoints` map to `placeOrder`?
            // But `orders.service.ts` logic uses `cart.items`.

            // To reliably support this "Global Toggle" without rewriting backend logic massively:
            // We should treat the "Points Only" and "Hybrid + Points Selected" as `payWithPoints=true`.
            // Ideally, we'd update the cart. 
            // Let's loop and update cart items if they differ from selection? 
            // Or assume user has updated them?
            // The user removed the checkboxes.

            // Fast fix: Update the cart items just before checkout?
            // Or even better: When `paymentMethod` changes, we fire an effect to update compatible items? 
            // Use debounce?

            // Let's try: Update all Hybrid items to match the selected method.
            // This ensures backend sees the right state.
            // We can do this in `useEffect` for `paymentMethod`.

            await handleCheckout(data);
            console.log('Checkout successful, redirecting to shop');
            toast.success('Order placed successfully! 🎉');
            router.push('/shop');
        } catch (error: any) {
            console.error('Checkout failed:', error);
            const message = error.message || error.data?.message || 'Checkout failed';
            toast.error(message);
        }
    };

    // Side effect to update cart items when global payment method changes
    // This ensures hybrid items have the correct payWithPoints status for the backendOrder creation
    // We need to be careful not to trigger infinite loops or excessive calls.
    React.useEffect(() => {
        if (!cart?.items) return;

        const updateCartItems = async () => {
            const updates = [];
            for (const item of cart.items) {
                if (item.purchaseType === 'HYBRID' || item.isHybrid) {
                    const shouldBePoints = paymentMethod === 'points';
                    if (item.payWithPoints !== shouldBePoints) {
                        // Need update
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
                // We might need to refresh cart? properties should update automatically via hook?
                // useCart should re-fetch or optimistically update.
            }
        };

        // Debounce or just run?
        updateCartItems();
    }, [paymentMethod, cart?.items]); // Add dependencies carefully. Updating cart will change cart.items, triggering effect again.
    // If logic is correct (item.payWithPoints !== shouldBePoints), it will settle.

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-pulse text-gray-400 font-medium">LOADING CHECKOUT...</div>
            </div>
        );
    }

    if (!cart?.items.length) {
        return (
            <div className="max-w-frame mx-auto px-4 py-12">
                <div className="text-center">
                    <h1 className={cn(integralCF.className, "text-3xl mb-4")}>Your cart is empty</h1>
                    <button
                        onClick={() => router.push('/shop')}
                        className="bg-black text-white px-6 py-3 rounded-full font-semibold"
                    >
                        Continue Shopping
                    </button>
                </div>
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
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                        {/* Card Details (Only if paying with card) */}
                        {paymentMethod === 'card' && (
                            <div className="bg-white border border-gray-100 rounded-2xl p-6">
                                <h2 className="text-xl font-bold mb-4">Card Details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <input
                                            {...register('cardHolderName')}
                                            type="text"
                                            placeholder="Cardholder Name"
                                            className={cn(
                                                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black",
                                                errors.cardHolderName ? "border-red-500" : "border-gray-200"
                                            )}
                                        />
                                        {errors.cardHolderName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.cardHolderName.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            {...register('cardNumber')}
                                            type="text"
                                            placeholder="Card Number (16 digits)"
                                            maxLength={16}
                                            className={cn(
                                                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black",
                                                errors.cardNumber ? "border-red-500" : "border-gray-200"
                                            )}
                                        />
                                        {errors.cardNumber && (
                                            <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                {...register('expiryDate')}
                                                type="text"
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                className={cn(
                                                    "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black",
                                                    errors.expiryDate ? "border-red-500" : "border-gray-200"
                                                )}
                                            />
                                            {errors.expiryDate && (
                                                <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                {...register('cvv')}
                                                type="text"
                                                placeholder="CVV"
                                                maxLength={4}
                                                className={cn(
                                                    "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black",
                                                    errors.cvv ? "border-red-500" : "border-gray-200"
                                                )}
                                            />
                                            {errors.cvv && (
                                                <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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

                        <button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isPlacing}
                            className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 mt-6"
                        >
                            {isPlacing ? 'Processing...' : `Complete Order - $${finalTotal.toFixed(2)}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}