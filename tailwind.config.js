/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#30384b',
        'bg-secondary': '#282f44',
        'bg-button-active': '#50586b',
        'text-primary': '#d6d7d9',
      },
      screens: {
        'mobile': {'max': '768px'},
      },
    },
  },
  plugins: [],
}

