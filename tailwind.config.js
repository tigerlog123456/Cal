/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Add custom colors for dark mode if needed
        darkBackground: '#1A202C', // Dark background color
        darkText: '#F7FAFC', // Dark text color
      },
    },
  },
  plugins: [],
}

