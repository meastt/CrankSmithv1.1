/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'text-white',
    'text-gray-100',
    'text-gray-200',
    'text-gray-300',
    'text-gray-800',
    'text-gray-900',
    'bg-white',
    'bg-gray-50',
    'bg-gray-100',
    'bg-gray-800',
    'bg-gray-900',
    'text-blue-600',
    'text-blue-500'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
