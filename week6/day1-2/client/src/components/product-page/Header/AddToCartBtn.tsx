"use client";

import { useCart } from "@/hooks/useCart";
import { useProfile } from "@/hooks/useProfile";
import { useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { Product, PurchaseType } from "@/types/product.types";
import React from "react";

const AddToCartBtn = ({ data }: { data: Product & { quantity: number; payWithPoints?: boolean } }) => {
  const { addItem, isAdding } = useCart();
  const { isAuthenticated } = useAuthStore();
  const { profile } = useProfile();
  const { addNotification } = useUIStore();
  const { sizeSelection, colorSelection } = useAppSelector(
    (state: RootState) => state.products
  );

  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN';

  const handleAdd = async () => {
    console.log("AddToCartBtn - Data:", data);
    console.log("AddToCartBtn - Selections:", { sizeSelection, colorSelection });

    // Check if item should be paid with points - ONLY if strictly POINTS_ONLY product.
    // Hybrid products now default to money payment when adding to cart, user can toggle in checkout.
    const payingWithPoints = data.purchaseType === PurchaseType.POINTS_ONLY;
    console.log("AddToCartBtn - payingWithPoints:", payingWithPoints, "PurchaseType:", data.purchaseType);

    if (payingWithPoints && (!isAuthenticated || (profile?.loyaltyPoints || 0) < (data.pointsPrice || 0) * data.quantity)) {
      addNotification(`You need ${(data.pointsPrice || 0) * data.quantity} points to purchase this item`, "error");
      return;
    }

    try {
      await addItem({
        productId: data.id as string,
        quantity: data.quantity,
        selectedSize: sizeSelection.toLowerCase().replace(' ', '-'),
        selectedColor: colorSelection.name,
        payWithPoints: payingWithPoints, // Use calculated payingWithPoints which accounts for POINTS_ONLY
        title: data.title,
        price: data.price,
        srcUrl: data.srcUrl,
        discount: data.discount,
        isPointsOnly: data.purchaseType === PurchaseType.POINTS_ONLY,
        isHybrid: data.purchaseType === PurchaseType.HYBRID,
        pointsPrice: data.pointsPrice,
      });
      addNotification("Added to cart successfully", "success");
    } catch (err: any) {
      console.error("Failed to add to cart", err);
      if (err.data) {
        console.error("Server Error Details:", err.data);
      }
      addNotification(err.data?.message || "Failed to add to cart", "error");
    }
  };

  return (
    <button
      type="button"
      disabled={isAdding || isAdmin}
      className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all disabled:opacity-50 font-medium"
      onClick={handleAdd}
    >
      {isAdding ? "Adding..." : isAdmin ? "Admins Restricted" : "Add to Cart"}
    </button>
  );
};

export default AddToCartBtn;
