/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    important: true,
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
      extend: {
        fontFamily: {
            poppins: ["Poppins", "sans-serif"],
        },
      },
    },
    plugins: [require("@tailwindcss/forms")],
  };
  