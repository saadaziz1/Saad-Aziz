"use client";

import { useThemeStore } from "@/store/theme";
import { useEffect } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme, hydrate, isHydrated } = useThemeStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300"
      aria-label="Toggle theme"
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
        }`}
      />
    </button>
  );
}