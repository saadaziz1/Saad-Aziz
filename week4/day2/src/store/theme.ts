import { create } from "zustand";

interface ThemeStore {
  theme: 'light' | 'dark';
  isHydrated: boolean;
  toggleTheme: () => void;
  hydrate: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'light',
  isHydrated: false,
  
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  },
  
  hydrate: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        set({ theme: savedTheme, isHydrated: true });
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } else {
        set({ isHydrated: true });
      }
    }
  }
}));