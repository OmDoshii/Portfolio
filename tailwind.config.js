/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        ink: '#1A1A2E',
        paper: '#F9F7F4',
        accent: '#F97316',
        muted: '#4B5563',
        border: '#E5E1D8',
        card: '#FFFFFF',
        'card-hover': '#FFF0E0',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'count-up': 'countUp 2s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
