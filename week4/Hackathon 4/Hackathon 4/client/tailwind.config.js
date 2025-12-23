/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E50000',
        dark: '#141414',
        darker: '#0F0F0F',
        gray: {
          800: '#1A1A1A',
          700: '#262626',
          600: '#333333',
          500: '#666666',
          400: '#999999',
          300: '#CCCCCC'
        }
      },
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}