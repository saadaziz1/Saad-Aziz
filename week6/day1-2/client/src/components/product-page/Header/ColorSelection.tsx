"use client";

import {
  Color,
  setColorSelection,
} from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import React from "react";
import { IoMdCheckmark } from "react-icons/io";

const ColorSelection = ({ colors }: { colors: string[] }) => {
  const { colorSelection } = useAppSelector(
    (state: RootState) => state.products
  );
  const dispatch = useAppDispatch();

  // Create color objects from product color strings
  // Assuming color string is the name, we map it to a basic color object
  // Ideally, product data should include color codes or we map them here
  const getColorCode = (name: string) => {
    // Map common colors to hex codes or classes
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
    return colorMap[name] || 'bg-gray-200';
  };

  const productColors: Color[] = colors ? colors.map(name => ({
    name,
    code: getColorCode(name)
  })) : [];

  return (
    <div className="flex flex-col">
      <span className="text-sm sm:text-base text-black/60 mb-4">
        Select Colors
      </span>
      <div className="flex items-center flex-wrap space-x-3 sm:space-x-4">
        {productColors.map((color, index) => (
          <button
            key={index}
            type="button"
            className={cn([
              color.code,
              "rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center",
            ])}
            onClick={() => dispatch(setColorSelection(color))}
          >
            {colorSelection.name === color.name && (
              <IoMdCheckmark className="text-base text-white" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelection;
