"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/store/useFilterStore";

const SizeSection = () => {
  const { size: selectedSize, setSize } = useFilterStore();

  const sizes = [
    { label: "XX-Small", value: "xx-small" },
    { label: "X-Small", value: "x-small" },
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
    { label: "X-Large", value: "x-large" },
    { label: "XX-Large", value: "xx-large" },
    { label: "3X-Large", value: "3x-large" },
    { label: "4X-Large", value: "4x-large" },
  ];

  return (
    <Accordion type="single" collapsible defaultValue="filter-size">
      <AccordionItem value="filter-size" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Size
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex items-center flex-wrap">
            {sizes.map((size, index) => (
              <button
                key={index}
                type="button"
                className={cn([
                  "bg-[#F0F0F0] m-1 flex items-center justify-center px-5 py-2.5 text-sm rounded-full max-h-[39px] hover:bg-black/10 transition-colors",
                  selectedSize === size.value && "bg-black font-medium text-white hover:bg-black/90",
                ])}
                onClick={() => setSize(size.value === selectedSize ? null : size.value)}
              >
                {size.label}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SizeSection;
