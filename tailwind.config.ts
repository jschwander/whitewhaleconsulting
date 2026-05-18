import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0f172a',
          dark: '#0a0f1a',
          light: '#1e293b',
          heading: '#0B1220',
        },
        page: '#F8FAFC',
        ivory: '#faf9f6',
        teal: {
          DEFAULT: '#0d9488',
          light: '#14b8a6',
          500: '#0d9488',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
