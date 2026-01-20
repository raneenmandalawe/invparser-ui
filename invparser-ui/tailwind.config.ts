import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './public/**/*.{html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Tailwind's blue-500
        secondary: '#64748B', // Tailwind's slate-500
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [],
};

export default config;