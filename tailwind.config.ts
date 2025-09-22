import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'young-serif': ['var(--font-young-serif)', 'serif'],
        'bitter': ['var(--font-bitter)', 'serif'],
        'hatton-ultralight': ['var(--font-hatton-ultralight)', 'sans-serif'],
        'montserrat': ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        // Brand Colors
        brand: {
          primary: '#3B3B3B',
          white: '#FFFFFF',
          black: '#000000',
        },
        primary: {
          main: '#3B3B3B',
          light: '#4A4A4A',
          dark: '#2D2D2D',
          hover: '#333333',
        },
      },
    },
  },
  plugins: [],
};

export default config;
