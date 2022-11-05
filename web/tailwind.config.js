/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Roboto, sans-sarif',
      },
      backgroundImage: {
        app: 'url(/app-bg.png)',
      },
      colors: {
        green: {
          500: '#129E57',
        },
        gray: {
          100: '#E1E1E6',
          200: '#C4C4CC',
          300: '#8D8D99',
          600: '#323238',
          800: '#202024',
          900: '#121214',
        },
        yellow: {
          500: '#F7DD43',
          700: '#DDC432'
        }
      }
    },
  },
  plugins: [],
}
