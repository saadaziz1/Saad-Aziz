import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (systemDark ? 'dark' : 'light');
    
    setTheme(currentTheme);
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300
        ${theme === "light" ? "bg-gray-200" : "bg-yellow-400"}
      `}
      aria-label="Toggle theme"
      variant="ghost"
    >
      <span
        className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md
          flex items-center justify-center
          transition-transform duration-300
          ${theme === "dark" ? "translate-x-7" : "translate-x-0"}
        `}
      >
        {theme === "light" ? (
          <Sun size={10} className="text-yellow-500" />
        ) : (
          <Moon size={10} className="text-gray-800" />
        )}
      </span>
    </Button>
  );
}