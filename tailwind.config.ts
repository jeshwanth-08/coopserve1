import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#0EA5A0',
          600: '#0097A7',
          700: '#00838F',
          800: '#006064',
          900: '#004D40',
          950: '#00363A',
        },
        accent: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(79, 70, 229, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 35px -8px rgba(15, 23, 42, 0.12), 0 8px 16px -4px rgba(79, 70, 229, 0.08)',
        'glow': '0 0 25px rgba(99, 102, 241, 0.35)',
        'glow-accent': '0 0 25px rgba(245, 158, 11, 0.35)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
