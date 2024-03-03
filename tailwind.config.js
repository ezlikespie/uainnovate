/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      ...colors,
      primary: '#E31937',
      secondary: '#5236AB',
      secondaryLight: '#785ecc',
      primarytext: '#151515',
    },
  },
  plugins: [],
};
