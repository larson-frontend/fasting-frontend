/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'rgb(229 231 235 / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
