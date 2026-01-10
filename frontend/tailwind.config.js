/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'glass-light': 'rgba(255, 255, 255, 0.7)',
        'glass-dark': 'rgba(17, 24, 39, 0.7)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

