import { create } from "zustand";

const getInitialTheme = () => {
  // 1. User saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  // 2. System preference
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  return prefersDark ? "dark" : "light";
};

const applyTheme = (theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

const useThemeStore = create((set) => {
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  return {
    theme: initialTheme,

    setTheme: (theme) => {
      applyTheme(theme);
      localStorage.setItem("theme", theme);
      set({ theme });
    },

    toggleTheme: () =>
      set((state) => {
        const nextTheme = state.theme === "light" ? "dark" : "light";
        applyTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
        return { theme: nextTheme };
      }),
  };
});

export default useThemeStore;
