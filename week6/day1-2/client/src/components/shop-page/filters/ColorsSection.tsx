"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IoMdCheckmark } from "react-icons/io";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/store/useFilterStore";

const colorMap: Record<string, string> = {
  "bg-green-600": "Green",
  "bg-red-600": "Red",
  "bg-yellow-300": "Yellow",
  "bg-orange-600": "Orange",
  "bg-cyan-400": "Cyan",
  "bg-blue-600": "Blue",
  "bg-purple-600": "Purple",
  "bg-pink-600": "Pink",
  "bg-white": "White",
  "bg-black": "Black",
};

const ColorsSection = () => {
  const { color: selectedColor, setColor } = useFilterStore();

  return (
    <Accordion type="single" collapsible defaultValue="filter-colors">
      <AccordionItem value="filter-colors" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Colors
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex space-2.5 flex-wrap md:grid grid-cols-5 gap-2.5">
            {Object.entries(colorMap).map(([className, name], index) => (
              <button
                key={index}
                type="button"
                className={cn([
                  className,
                  "rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center border border-black/20",
                ])}
                onClick={() => setColor(name === selectedColor ? null : name)}
              >
                {selectedColor === name && (
                  <IoMdCheckmark className={cn("text-base", name === "White" ? "text-black" : "text-white")} />
                )}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ColorsSection;
