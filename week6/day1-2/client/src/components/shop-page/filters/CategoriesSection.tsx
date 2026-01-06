import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useFilterStore } from "@/store/useFilterStore";
import { cn } from "@/lib/utils";

type Category = {
  title: string;
  id: string;
};

const categoriesData: Category[] = [
  {
    title: "T-shirts",
    id: "t-shirts",
  },
  {
    title: "Shorts",
    id: "shorts",
  },
  {
    title: "Shirts",
    id: "shirts",
  },
  {
    title: "Hoodie",
    id: "hoodie",
  },
  {
    title: "Jeans",
    id: "jeans",
  },
];

const CategoriesSection = () => {
  const { type: selectedType, setType } = useFilterStore();

  return (
    <div className="flex flex-col space-y-0.5 text-black/60">
      {categoriesData.map((category, idx) => (
        <button
          key={idx}
          onClick={() => setType(category.id === selectedType ? null : category.id)}
          className={cn(
            "flex items-center justify-between py-2 w-full text-left hover:text-black transition-colors",
            category.id === selectedType && "text-black font-semibold"
          )}
        >
          {category.title} <MdKeyboardArrowRight />
        </button>
      ))}
    </div>
  );
};

export default CategoriesSection;
