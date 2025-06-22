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
        'dark-bg': '#0e0e10',
        'brand': {
          'blue': '#3b82f6',
          'cyan': '#06b6d4',
          'amber': '#eab308',
        },
      },
      boxShadow: {
        'glow-blue': '0 0 15px 0 rgba(59, 130, 246, 0.5)',
        'glow-blue-hover': '0 0 25px 5px rgba(59, 130, 246, 0.6)',
      },
    },
  },
  plugins: [],
} 