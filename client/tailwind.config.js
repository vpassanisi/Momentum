const materialPalette = require("./materialPalette.js");

module.exports = {
  corePlugins: {
    backgroundOpacity: false,
  },
  purge: [
    "./src/**/*.html",
    "./src/**/*.vue",
    "./src/**/*.js",
    "./src/**/*.svelte",
    "./src/**/*.jsx",
    "./public/*.html",
  ],
  theme: {
    boxShadow: {
      default: "0px 4px 8px 0px rgba(0,0,0,0.10)",
    },
    colors: materialPalette,
    extend: {
      transitionProperty: {
        height: "height",
      },
    },
  },
  variants: {
    backgroundColor: ["dark", "hover"],
    textColor: ["dark"],
    placeholderColor: ["dark-placeholder"],
    borderColor: ["dark"],
  },
  plugins: [require("tailwindcss-dark-mode")()],
};
