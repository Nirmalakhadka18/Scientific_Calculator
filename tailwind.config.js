/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        casio: {
          chassis: '#1e242b',
          chassisDark: '#15191e',
          bezel: '#28303a',
          lcdBg: '#b9cbb6',
          lcdPixel: '#1a2718',
          lcdDim: '#99a896',
          shift: '#e69d00',
          alpha: '#d62246',
          acDel: '#c85a17',
          keyDark: '#2c353d',
          keyLight: '#e2e8f0',
          keyBlue: '#2563eb',
        },
      },
      fontFamily: {
        lcd: ['"Share Tech Mono"', 'monospace'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
