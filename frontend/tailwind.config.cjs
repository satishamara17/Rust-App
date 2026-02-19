/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ct-dark-600': '#f0f0f5',
        'ct-dark-200': '#a0a0b8',
        'ct-dark-100': '#6b6b85',
        'ct-blue-600': '#a855f7',
        'ct-blue-700': '#7c3aed',
        'ct-yellow-600': '#f9d13e',
        'glass-bg': 'rgba(30, 30, 50, 0.7)',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
        'glass-border-hover': 'rgba(255, 255, 255, 0.15)',
        'dark-primary': '#0f0f1a',
        'dark-secondary': '#1a1a2e',
        'dark-card': 'rgba(30, 30, 50, 0.7)',
      },
      fontFamily: {
        Inter: ['Inter', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          lg: '1125px',
          xl: '1125px',
          '2xl': '1125px',
          '3xl': '1500px'
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
