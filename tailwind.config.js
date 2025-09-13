/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/helpers/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bitcount: ['var(--font-bitcount)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};