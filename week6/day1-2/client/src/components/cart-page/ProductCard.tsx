"use client";

import React from "react";
import { PiTrashFill } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
import CartCounter from "@/components/ui/CartCounter";
import { Button } from "../ui/button";
import { useCart } from "@/hooks/useCart";

type ProductCardProps = {
  data: any; // Using any for simplicity as it matches CartItem from hook
};

const ProductCard = ({ data }: ProductCardProps) => {
  const { updateQuantity, removeItem } = useCart();
  const itemId = data.productId || data.id;

  return (
    <div className="flex items-start space-x-4">
      <Link
        href={`/shop/product/${itemId}/${data.title.split(" ").join("-")}`}
        className="bg-[#F0EEED] rounded-lg w-full min-w-[100px] max-w-[100px] sm:max-w-[124px] aspect-square overflow-hidden"
      >
        <Image
          src={data.srcUrl}
          width={124}
          height={124}
          className="rounded-md w-full h-full object-cover hover:scale-110 transition-all duration-500"
          alt={data.title}
          priority
        />
      </Link>
      <div className="flex w-full self-stretch flex-col">
        <div className="flex items-center justify-between">
          <Link
            href={`/shop/product/${itemId}/${data.title.split(" ").join("-")}`}
            className="text-black font-bold text-base xl:text-xl"
          >
            {data.title}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 md:h-9 md:w-9 hover:bg-red-50 group"
            onClick={() => removeItem(itemId, data.selectedColor, data.selectedSize)}
          >
            <PiTrashFill className="text-xl md:text-2xl text-red-600 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
        <div className="flex flex-col space-y-0.5">
          {data.selectedSize && (
            <div>
              <span className="text-black text-xs md:text-sm mr-1">Size:</span>
              <span className="text-black/60 text-xs md:text-sm uppercase">
                {data.selectedSize}
              </span>
            </div>
          )}
          {data.selectedColor && (
            <div>
              <span className="text-black text-xs md:text-sm mr-1">Color:</span>
              <span className="text-black/60 text-xs md:text-sm">
                {data.selectedColor}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center flex-wrap justify-between mt-auto">
          <div className="flex items-center space-x-[5px] xl:space-x-2.5">
            {(data.payWithPoints || data.isPointsOnly || data.purchaseType === 'POINTS_ONLY') ? (
              <div className="flex flex-col">
                <span className="font-bold text-violet-600 text-xl xl:text-2xl">
                  {data.pointsPrice} pts
                </span>
                <span className="text-[10px] text-violet-400 font-bold uppercase">Points Payment</span>
              </div>
            ) : (
              <>
                {data.discount?.percentage > 0 ? (
                  <span className="font-bold text-black text-xl xl:text-2xl">
                    {`$${Math.round(
                      data.price - (data.price * data.discount.percentage) / 100
                    )}`}
                  </span>
                ) : (
                  <span className="font-bold text-black text-xl xl:text-2xl">
                    ${data.price}
                  </span>
                )}
                {data.discount?.percentage > 0 && (
                  <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
                    ${data.price}
                  </span>
                )}
                {data.discount?.percentage > 0 && (
                  <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                    {`-${data.discount.percentage}%`}
                  </span>
                )}
              </>
            )}
          </div>
          <CartCounter
            initialValue={data.quantity}
            onAdd={() => updateQuantity(itemId, data.quantity + 1, data.selectedColor, data.selectedSize)}
            onRemove={() =>
              data.quantity === 1
                ? removeItem(itemId, data.selectedColor, data.selectedSize)
                : updateQuantity(itemId, data.quantity - 1, data.selectedColor, data.selectedSize)
            }
            isZeroDelete
            className="px-5 py-3 max-h-8 md:max-h-10 min-w-[105px] max-w-[105px] sm:max-w-32"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
