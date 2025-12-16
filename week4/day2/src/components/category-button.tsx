/* eslint-disable @next/next/no-img-element */

import { useStore } from "@/store";

interface CategoryButtonProps {
  categories: string;
  type: "tools" | "languages" | "level" | "role";
}

export function CategoryButton({ categories, type }: CategoryButtonProps) {
  const removeCategory = useStore((store) => store.removeCategory);

  return (
    <div className="flex items-center">
      <div className="laptop:py-1 laptop:px-1 bg-cyan-100 px-2 py-[3px] rounded-s-md">
        <span className="laptop:text-sm text-base font-medium text-cyan-800 ">
          {categories}
        </span>
      </div>
      <button
        onClick={() => removeCategory(type, categories)}
        className=" rounded-e-md bg-cyan-800 p-2 transition-all hover:bg-cyan-950"
      >
        <img src="./images/icon-remove.svg" alt="close button" />
      </button>
    </div>
  );
}
