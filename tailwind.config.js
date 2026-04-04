/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./assets/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#1e2022', // Softer black for premium reading
          light: '#f8f9fa', 
          accent: '#0d6efd',
        }
      }
    },
  },
  plugins: [],
}
