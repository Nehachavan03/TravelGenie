/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffbeb',  // cream
          100: '#fef3c7', // light yellow
          500: '#eab308', // yellow
          600: '#ca8a04', // royal yellow
          700: '#a16207', // dark royal yellow
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
