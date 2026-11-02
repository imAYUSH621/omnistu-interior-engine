/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Manrope', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
        display: ['Manrope', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f9f8f6',
          100: '#f2efe9',
          200: '#e3dcce',
          300: '#cfc1ac',
          400: '#b8a184',
          500: '#a38461',
          600: '#8e6d4c',
          700: '#75563c',
          800: '#604734',
          900: '#503c2d',
          950: '#2c2017',
        },
        luxury: {
          charcoal: '#121212',
          onyx: '#18181b',
          stone: '#27272a',
          gold: '#d4af37',
          bronze: '#b38053',
          warm: '#f5f2eb'
        }
      }
    },
  },
  plugins: [],
}
