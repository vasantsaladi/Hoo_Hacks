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
        primary: {
          DEFAULT: "#22c55e", // Green color from the logo
          light: "#4ade80",
          dark: "#16a34a",
        },
        secondary: "#ffffff", // White color
        accent: "#22c55e", // Green accent
        background: {
          dark: "#0f172a", // Current dark background
          light: "#ffffff", // White background option
        }
      },
    },
  },
  plugins: [],
};
