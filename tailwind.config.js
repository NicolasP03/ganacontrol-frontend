/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "green-900": "#1a3d1a",
        "green-800": "#1e4d1e",
        "green-700": "#2e7d2e",
        "green-600": "#3a9c3a",
        "green-500": "#22c55e",
        "green-400": "#4ade80",
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        serif:   ["Merriweather", "Georgia", "serif"],
        display: ["Public Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};