/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EEF4FF',
          100: '#E0ECFF',
          200: '#C7DAFF',
          300: '#A4C0FF',
          400: '#799CFF',
          500: '#4F72F8',
          600: '#2E4EED',
          700: '#1E3A8A',
          800: '#1a3270',
          900: '#0F1E50',
        },
        accent: '#F97316',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
