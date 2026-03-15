/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        infiniteSlider: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-33.333%,0,0)" },
        },
      },
      animation: {
        "infinite-slider": "infiniteSlider 20s linear infinite",
      },
    },
  },
  plugins: [],
};