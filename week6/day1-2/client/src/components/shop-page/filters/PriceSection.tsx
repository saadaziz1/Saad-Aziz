"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useFilterStore } from "@/store/useFilterStore";

const PriceSection = () => {
  // Use selective selectors to avoid unnecessary re-renders
  const storeMinPrice = useFilterStore((state) => state.minPrice);
  const storeMaxPrice = useFilterStore((state) => state.maxPrice);
  const setPriceRange = useFilterStore((state) => state.setPriceRange);

  // Local state for smooth sliding
  const [localRange, setLocalRange] = useState([storeMinPrice, storeMaxPrice]);

  // Sync local state when store changes (e.g. on Reset)
  useEffect(() => {
    setLocalRange([storeMinPrice, storeMaxPrice]);
  }, [storeMinPrice, storeMaxPrice]);

  // When value changes during drag (Fast UI update)
  const handleValueChange = (val: number[]) => {
    setLocalRange(val);
  };

  // When drag ends (Heavy data fetch)
  const handleValueCommit = (val: number[]) => {
    setPriceRange(val[0], val[1]);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <div className="flex items-center justify-between py-0.5">
          <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0">
            Price
          </AccordionTrigger>
          <span className="text-xs font-medium text-black/60">
            ${localRange[0]} - ${localRange[1]}
          </span>
        </div>
        <AccordionContent className="pt-8 pb-0" contentClassName="overflow-visible">
          <Slider
            value={localRange}
            onValueChange={handleValueChange}
            onValueCommit={handleValueCommit}
            min={0}
            max={500}
            step={1}
            label="$"
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;
