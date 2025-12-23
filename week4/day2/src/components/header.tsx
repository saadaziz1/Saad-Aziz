"use client";

import { usePathname } from "next/navigation";
import { useStore } from "@/store";
import { CategoryButton } from "@/components/category-button";
import { ClearButton } from "@/components/clear-button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const categories = useStore((store) => store.categories);
  const isJobDetailsPage = pathname.startsWith('/jobs/');

  return (
    <header className="h-[156px] bg-cyan-800 dark:bg-gray-800 bg-header-desktop bg-cover bg-center transition-colors relative">
      <div className="mx-auto max-w-app px-6 h-full">
        <div className="flex justify-end pt-4">
          <ThemeToggle />
        </div>
        <div className="flex items-end h-full pb-4">
          {categories && !isJobDetailsPage && (
            <div className="mx-auto mb-[-30px] flex w-full max-w-job justify-between gap-4 rounded-lg bg-white dark:bg-gray-800 px-10 py-5 transition-colors shadow-lg">
          <div className="laptop:gap-2 flex flex-wrap gap-4 ">
            {categories.role && (
              <CategoryButton categories={categories.role} type="role" />
            )}

            {categories.level && (
              <CategoryButton categories={categories.level} type="level" />
            )}

            {categories.languages?.map((language, index) => (
              <CategoryButton
                key={language + index}
                categories={language}
                type="languages"
              />
            ))}

            {categories.tools?.map((tool, index) => (
              <CategoryButton
                key={tool + index}
                categories={tool}
                type="tools"
              />
            ))}
          </div>

              <ClearButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
