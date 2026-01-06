import React from "react";
import CategoriesSection from "@/components/shop-page/filters/CategoriesSection";
import ColorsSection from "@/components/shop-page/filters/ColorsSection";
import DressStyleSection from "@/components/shop-page/filters/DressStyleSection";
import PriceSection from "@/components/shop-page/filters/PriceSection";
import SizeSection from "@/components/shop-page/filters/SizeSection";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/store/useFilterStore";

const Filters = () => {
  const { reset } = useFilterStore();

  return (
    <div className="flex flex-col space-y-5 md:space-y-6">
      <hr className="border-t-black/10" />
      <CategoriesSection />
      <hr className="border-t-black/10" />
      <PriceSection />
      <hr className="border-t-black/10" />
      <ColorsSection />
      <hr className="border-t-black/10" />
      <SizeSection />
      <hr className="border-t-black/10" />
      <DressStyleSection />
      <Button
        type="button"
        onClick={reset}
        variant="outline"
        className="w-full rounded-full text-sm font-medium py-4 h-12 border-black/10 hover:bg-black hover:text-white transition-all"
      >
        Reset All Filters
      </Button>
    </div>
  );
};

export default Filters;
