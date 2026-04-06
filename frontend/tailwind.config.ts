import type { Config } from 'tailwindcss';

const config: Config = {
  corePlugins: {
    preflight: false,
  },
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#E85D04',
          amber: '#F48C06',
          gold: '#D4A574',
        },
        loader: {
          bg: '#f7f4f0',
        },
      },
      boxShadow: {
        'glow-amber': '0 0 28px rgba(244, 140, 6, 0.28)',
        'glow-orange': '0 0 32px rgba(232, 93, 4, 0.22)',
      },
    },
  },
  plugins: [],
};

export default config;
