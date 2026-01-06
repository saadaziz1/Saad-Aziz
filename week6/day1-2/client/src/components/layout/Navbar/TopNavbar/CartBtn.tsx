"use client";

import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CartBtn = () => {
  const { cart } = useCart();
  const { user } = useAuthStore();
  const totalItems = cart?.totalQuantities || 0;
  
  // Hide cart for admins
  if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
    return null;
  }

  return (
    <Link href="/cart" className="relative mr-[14px] p-1">
      <Image
        priority
        src="/icons/cart.svg"
        height={100}
        width={100}
        alt="cart"
        className="max-w-[22px] max-h-[22px]"
      />
      {totalItems > 0 && (
        <span className="bg-black text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] absolute -top-1 -right-1 font-bold border-2 border-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartBtn;
