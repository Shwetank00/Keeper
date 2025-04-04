/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // colors used in here
      colors: {
        primary: "#2B85FF",
        secondary: "#EF863E",
        yell: "#eab308",
      },
    },
  },
  plugins: [],
};
