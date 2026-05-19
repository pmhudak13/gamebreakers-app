/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        gba: {
          navy: '#01003b',
          gray: '#a4a4a4',
          white: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}
