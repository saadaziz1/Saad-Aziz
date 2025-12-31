import React from 'react'
import { Button } from '../ui/button'
import useThemeStore from '@/store/ThemeStore'
import { Moon, Sun } from 'lucide-react'

const LightDarkButton = () => {
    const { theme, toggleTheme}  = useThemeStore()
  return (
    <Button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300
        ${theme === "light" ? "bg-gray-200" : "bg-yellow-400"}
      `}
      aria-label="Toggle theme"
      variant="ghost"
    >
      {/* SLIDER */}
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
  )
}

export default LightDarkButton