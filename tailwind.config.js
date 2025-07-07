/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'text-white',
    'text-blue-600',
    'text-blue-500'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
