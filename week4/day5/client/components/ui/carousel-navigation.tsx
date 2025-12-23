"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function CarouselNavigation({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext
}: CarouselNavigationProps) {
  return (
    <div className="hidden lg:flex items-center gap-4 p-4 rounded-md bg-[#0F0F0F] border border-[#1F1F1F]">
      <Button
        variant="outline"
        
        className="bg-[#1F1F1F] w-11 h-11 3xl:w-14 3xl:h-14 border-[#262626] text-white hover:bg-[#E50000]/90"
        onClick={onPrevious}
      >
        <ArrowLeft className="w-6 h-6 3xl:w-8 3xl:h-8" />
      </Button>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(totalSlides, 4) }, (_, index) => (
          <div
            key={index}
            className={`h-1 w-4 3xl:w-6 3xl:h-2 rounded-full transition-colors duration-300 ${
              index === (currentSlide % Math.min(totalSlides, 4)) ? "bg-red-600" : "bg-[#262626]"
            }`}
          />
        ))}
      </div>
      
      <Button
        variant="outline"
       
        className="bg-[#1F1F1F] w-11 h-11  3xl:w-14 3xl:h-14 border-[#262626] text-white hover:bg-[#E50000]/90"
        onClick={onNext}
      >
        <ArrowRight className="w-6 h-6 3xl:w-8 3xl:h-8" />
      </Button>
    </div>
  );
}