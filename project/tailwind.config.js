/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Updated to include all files in src
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        "button, [type='button'], [type='reset'], [type='submit']": {
          "-webkit-appearance": "button",
          appearance: "button",
          "background-color": "transparent",
          "background-image": "none",
        },
        "[type='search']": {
          "-webkit-appearance": "textfield",
          appearance: "textfield",
          "outline-offset": "-2px",
        },
        "img, svg, video, canvas, audio, iframe, embed, object": {
          display: "block",
          "max-width": "100%",
          height: "auto",
        },
        ".line-clamp-2": {
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": "2",
          "line-clamp": "2",
        },
      });
    },
  ],
};