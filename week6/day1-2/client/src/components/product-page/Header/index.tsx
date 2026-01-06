import React, { useEffect } from "react";
import PhotoSection from "./PhotoSection";
import { Product, PurchaseType } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import ColorSelection from "./ColorSelection";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";
import { useAppDispatch } from "@/lib/hooks/redux";
import { setColorSelection, setSizeSelection } from "@/lib/features/products/productsSlice";

const Header = ({ data }: { data: Product }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize color selection with the first available color
    if (data.colors && data.colors.length > 0) {
      // Map basic color names to codes if needed, mirroring ColorSelection logic
      // But for slice state, we need a {name, code} object
      const colorMap: Record<string, string> = {
        'Brown': 'bg-[#4F4631]',
        'Green': 'bg-[#314F4A]',
        'Blue': 'bg-[#31344F]',
        'Black': 'bg-black',
        'White': 'bg-white border border-gray-200',
        'Red': 'bg-red-500',
        'Yellow': 'bg-yellow-500',
        'Grey': 'bg-gray-500',
        'Pink': 'bg-pink-500',
        'Purple': 'bg-purple-500',
        'Orange': 'bg-orange-500',
      };

      const firstColor = data.colors[0];
      dispatch(setColorSelection({
        name: firstColor,
        code: colorMap[firstColor] || 'bg-gray-200'
      }));
    }

    // Initialize size selection with the first available size
    if (data.sizes && data.sizes.length > 0) {
      dispatch(setSizeSelection(data.sizes[0]));
    }
  }, [data, dispatch]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <PhotoSection data={data} />
        </div>
        <div>
          <h1
            className={cn([
              integralCF.className,
              "text-2xl md:text-[40px] md:leading-[40px] mb-3 md:mb-3.5 capitalize",
            ])}
          >
            {data.title}
          </h1>
          <div className="flex items-center mb-3 sm:mb-3.5">
            <Rating
              initialValue={data.rating}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-50"
              size={25}
              readonly
            />
            <span className="text-black text-xs sm:text-sm ml-[11px] sm:ml-[13px] pb-0.5 sm:pb-0">
              {data.rating.toFixed(1)}
              <span className="text-black/60">/5</span>
            </span>
          </div>
          <div className="flex items-center space-x-2.5 sm:space-x-3 mb-5">
            {data.purchaseType === PurchaseType.POINTS_ONLY ? (
              <>
                <span className="font-bold text-black italic text-2xl sm:text-[32px]">
                  {data.pointsPrice} pts
                </span>
                <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-violet-100 text-violet-700">
                  POINTS ONLY
                </span>
              </>
            ) : data.purchaseType === PurchaseType.HYBRID ? (
              <>
                <span className="font-bold text-black text-2xl sm:text-[32px]">
                  ${data.price}
                </span>
                <span className="text-sm text-black italic font-medium">
                  or {data.pointsPrice} pts
                </span>
                <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-blue-100 text-blue-700">
                  HYBRID
                </span>
              </>
            ) : (
              <>
                {data.discount.percentage > 0 ? (
                  <span className="font-bold text-black text-2xl sm:text-[32px]">
                    {`$${Math.round(
                      data.price - (data.price * data.discount.percentage) / 100
                    )}`}
                  </span>
                ) : data.discount.amount > 0 ? (
                  <span className="font-bold text-black text-2xl sm:text-[32px]">
                    {`$${data.price - data.discount.amount}`}
                  </span>
                ) : (
                  <span className="font-bold text-black text-2xl sm:text-[32px]">
                    ${data.price}
                  </span>
                )}
                {data.discount.percentage > 0 && (
                  <span className="font-bold text-black/40 line-through text-2xl sm:text-[32px]">
                    ${data.price}
                  </span>
                )}
                {data.discount.amount > 0 && (
                  <span className="font-bold text-black/40 line-through text-2xl sm:text-[32px]">
                    ${data.price}
                  </span>
                )}
                {data.discount.percentage > 0 ? (
                  <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                    {`-${data.discount.percentage}%`}
                  </span>
                ) : (
                  data.discount.amount > 0 && (
                    <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                      {`-$${data.discount.amount}`}
                    </span>
                  )
                )}
              </>
            )}
          </div>
          <p className="text-sm sm:text-base text-black/60 mb-5">
            {data.description} </p>
          <hr className="h-px border-t-black/10 mb-5" />
          <ColorSelection colors={data.colors || []} />
          <hr className="h-px border-t-black/10 my-5" />
          <SizeSelection sizes={data.sizes || []} />
          <hr className="hidden md:block h-px border-t-black/10 my-5" />
          <AddToCardSection data={data} />
        </div>
      </div>
    </>
  );
};

export default Header;
