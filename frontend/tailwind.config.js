/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bhoomi: {
          dark: '#0B0F19',
          card: '#131A2B',
          hover: '#1E283D',
          border: '#2A364F',
          primary: '#10B981',
          accent: '#3B82F6',
          danger: '#EF4444',
          warning: '#F59E0B',
          govGold: '#D97706',
        }
      }
    },
  },
  plugins: [],
}
