import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useFilterStore } from "@/store/useFilterStore";
import { cn } from "@/lib/utils";

type DressStyle = {
  title: string;
  id: string;
};

const dressStylesData: DressStyle[] = [
  {
    title: "Casual",
    id: "casual",
  },
  {
    title: "Formal",
    id: "formal",
  },
  {
    title: "Party",
    id: "party",
  },
  {
    title: "Gym",
    id: "gym",
  },
];

const DressStyleSection = () => {
  const { style: selectedStyle, setStyle } = useFilterStore();

  return (
    <Accordion type="single" collapsible defaultValue="filter-style">
      <AccordionItem value="filter-style" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Dress Style
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-col text-black/60 space-y-0.5">
            {dressStylesData.map((dStyle, idx) => (
              <button
                key={idx}
                onClick={() => setStyle(dStyle.id === selectedStyle ? null : dStyle.id)}
                className={cn(
                  "flex items-center justify-between py-2 w-full text-left hover:text-black transition-colors",
                  dStyle.id === selectedStyle && "text-black font-semibold"
                )}
              >
                {dStyle.title} <MdKeyboardArrowRight />
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DressStyleSection;
