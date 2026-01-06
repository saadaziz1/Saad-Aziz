"use client";

import BreadcrumbCart from "@/components/cart-page/BreadcrumbCart";
import ProductCard from "@/components/cart-page/ProductCard";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineLocalOffer } from "react-icons/md";
import { TbBasketExclamation } from "react-icons/tb";
import React from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";

export default function CartPage() {
  const { cart, isLoading } = useCart();
  const { handleCheckout, isPlacing } = useOrders();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addNotification } = useUIStore();

  const totalPrice = cart?.items.reduce((acc: number, item: any) => {
    const isPointsPayment = item.payWithPoints || item.isPointsOnly || item.purchaseType === 'POINTS_ONLY';
    if (isPointsPayment) return acc;
    return acc + (item.price * item.quantity);
  }, 0) || 0;

  const totalDiscount = cart?.items.reduce((acc: number, item: any) => {
    const isPointsPayment = item.payWithPoints || item.isPointsOnly || item.purchaseType === 'POINTS_ONLY';
    if (isPointsPayment) return acc;
    const discount = (item.price * (item.discount?.percentage || 0)) / 100;
    return acc + (discount * item.quantity);
  }, 0) || 0;

  const totalItemPoints = cart?.items.reduce((acc: number, item: any) => {
    const isPointsPayment = item.payWithPoints || item.isPointsOnly || item.purchaseType === 'POINTS_ONLY';
    if (!isPointsPayment) return acc;
    return acc + ((item.pointsPrice || 0) * item.quantity);
  }, 0) || 0;

  const adjustedTotalPrice = totalPrice - totalDiscount;

  const onCheckout = async () => {
    if (!isAuthenticated) {
      addNotification("Please login to proceed to checkout", "info");
      router.push("/login?redirect=cart");
      return;
    }

    try {
      await handleCheckout();
      addNotification("Order placed successfully!", "success");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Checkout failed", err);
      const message = err.message || err.data?.message || "Checkout failed. Please try again.";
      addNotification(message, "error");
    }
  };

  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-pulse text-gray-400 font-medium uppercase tracking-widest">Hydrating Cart...</div>
    </div>
  );

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        {cart && cart.items.length > 0 ? (
          <>
            <BreadcrumbCart />
            <h2
              className={cn([
                integralCF.className,
                "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
              ])}
            >
              your cart
            </h2>
            <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 items-start">
              <div className="w-full p-3.5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
                {cart?.items.map((product: any, idx: number, arr: any[]) => (
                  <React.Fragment key={idx}>
                    <ProductCard data={product} />
                    {arr.length - 1 !== idx && (
                      <hr className="border-t-black/10" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="w-full lg:max-w-[505px] p-5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
                <h6 className="text-xl md:text-2xl font-bold text-black">
                  Order Summary
                </h6>
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">Subtotal</span>
                    <span className="md:text-xl font-bold">${totalPrice}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="md:text-xl text-black/60">
                        Discount
                      </span>
                      <span className="md:text-xl font-bold text-red-600">
                        -${Math.round(totalDiscount)}
                      </span>
                    </div>
                  )}
                  {totalItemPoints > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="md:text-xl text-violet-600 font-bold">
                        Points for Items
                      </span>
                      <span className="md:text-xl font-bold text-violet-600">
                        {totalItemPoints.toLocaleString()} pts
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">
                      Delivery Fee
                    </span>
                    <span className="md:text-xl font-bold">Free</span>
                  </div>
                  <hr className="border-t-black/10" />
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black">Total</span>
                    <span className="text-xl md:text-2xl font-bold">
                      ${Math.round(adjustedTotalPrice)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <InputGroup className="bg-[#F0F0F0]">
                    <InputGroup.Text>
                      <MdOutlineLocalOffer className="text-black/40 text-2xl" />
                    </InputGroup.Text>
                    <InputGroup.Input
                      type="text"
                      name="code"
                      placeholder="Add promo code"
                      className="bg-transparent placeholder:text-black/40"
                    />
                  </InputGroup>
                  <Button
                    type="button"
                    className="bg-black rounded-full w-full max-w-[119px] h-[48px]"
                  >
                    Apply
                  </Button>
                </div>
                <Button
                  type="button"
                  onClick={() => router.push('/checkout')}
                  className="text-sm md:text-base font-medium bg-black rounded-full w-full py-4 h-[54px] md:h-[60px] group"
                >
                  Go to Checkout
                  <FaArrowRight className="text-xl ml-2 group-hover:translate-x-1 transition-all" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center flex-col text-gray-300 mt-32">
            <TbBasketExclamation strokeWidth={1} className="text-6xl" />
            <span className="block mb-4">Your shopping cart is empty.</span>
            <Button className="rounded-full w-24" asChild>
              <Link href="/shop">Shop</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
