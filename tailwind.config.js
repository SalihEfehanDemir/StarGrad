const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'dark-bg': '#0D1117',
        'primary': '#00f6ff',
        'secondary': '#ff00ff',
        'glass': 'rgba(13, 17, 23, 0.7)',
        'light-gray': '#8B949E',
        'border-color': 'rgba(255, 255, 255, 0.1)',
      },
      boxShadow: {
        'glow-blue': '0 0 15px 0 rgba(59, 130, 246, 0.5)',
        'glow-blue-hover': '0 0 25px 5px rgba(59, 130, 246, 0.6)',
      },
      backdropBlur: {
        'xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
} 