/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: 'rgb(var(--brand-orange) / <alpha-value>)',
          yellow: 'rgb(var(--brand-yellow) / <alpha-value>)',
          blue: 'rgb(var(--brand-blue) / <alpha-value>)',
          purple: 'rgb(var(--brand-purple) / <alpha-value>)',
          green: 'rgb(var(--brand-green) / <alpha-value>)',
          red: 'rgb(var(--brand-red) / <alpha-value>)',
        },
        neutral: {
          50: 'rgb(var(--neutral-50) / <alpha-value>)',
          100: 'rgb(var(--neutral-100) / <alpha-value>)',
          200: 'rgb(var(--neutral-200) / <alpha-value>)',
          300: 'rgb(var(--neutral-300) / <alpha-value>)',
          400: 'rgb(var(--neutral-400) / <alpha-value>)',
          500: 'rgb(var(--neutral-500) / <alpha-value>)',
          600: 'rgb(var(--neutral-600) / <alpha-value>)',
          700: 'rgb(var(--neutral-700) / <alpha-value>)',
          800: 'rgb(var(--neutral-800) / <alpha-value>)',
          900: 'rgb(var(--neutral-900) / <alpha-value>)',
          950: 'rgb(var(--neutral-950) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgb(var(--brand-blue) / 0.3)',
        'glow-md': '0 0 20px rgb(var(--brand-blue) / 0.4)',
        'glow-lg': '0 0 40px rgb(var(--brand-blue) / 0.5)',
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-performance': 'var(--gradient-performance)',
        'gradient-premium': 'var(--gradient-premium)',
        'gradient-success': 'var(--gradient-success)',
        'gradient-green': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'gradient-orange': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'gradient-purple': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        'gradient-blue': 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.animation-delay-100': {
          'animation-delay': '100ms',
        },
        '.animation-delay-200': {
          'animation-delay': '200ms',
        },
        '.animation-delay-300': {
          'animation-delay': '300ms',
        },
        '.animation-delay-500': {
          'animation-delay': '500ms',
        },
        '.animation-delay-1000': {
          'animation-delay': '1000ms',
        },
        '.bg-compatibility-error': {
          'background-color': 'rgba(239, 68, 68, 0.1)',
        },
        '.bg-compatibility-warning': {
          'background-color': 'rgba(245, 158, 11, 0.1)',
        },
        '.bg-compatibility-success': {
          'background-color': 'rgba(76, 175, 80, 0.1)',
        },
        '.border-compatibility-error': {
          'border-color': '#dc3545',
        },
        '.border-compatibility-warning': {
          'border-color': '#ffc107',
        },
        '.border-compatibility-success': {
          'border-color': '#4CAF50',
        },
        '.text-compatibility-error': {
          'color': '#dc3545',
        },
        '.text-compatibility-warning': {
          'color': '#ffc107',
        },
        '.text-compatibility-success': {
          'color': '#4CAF50',
        },
        '.bg-compatibility-error-dot': {
          'background-color': '#dc3545',
        },
        '.bg-compatibility-warning-dot': {
          'background-color': '#ffc107',
        },
        '.bg-compatibility-success-dot': {
          'background-color': '#4CAF50',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
