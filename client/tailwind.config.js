const materialPalette = require("./materialPalette.js");

module.exports = {
  corePlugins: {
    borderOpacity: false,
  },
  purge: {
    content: [
      "./src/**/*.html",
      "./src/**/*.vue",
      "./src/**/*.js",
      "./src/**/*.svelte",
      "./src/**/*.jsx",
      "./public/*.html",
    ],
    options: {
      whitelist: ["mode-dark"],
    },
  },
  theme: {
    rotate: {
      "-180": "-180deg",
      "-135": "-135deg",
      "-90": "-90deg",
      "-45": "-45deg",
      "0": "0",
      "45": "45deg",
      "90": "90deg",
      "135": "135deg",
      "180": "180deg",
    },
    boxShadow: {
      default: "0px 4px 8px 0px rgba(0,0,0,0.10)",
    },
    colors: materialPalette,
    extend: {
      transitionProperty: {
        height: "height",
        button: "background-color, margin",
      },
    },
  },
  variants: {
    backgroundColor: ["dark", "hover", "focus"],
    textColor: ["dark"],
    placeholderColor: ["dark-placeholder"],
    borderColor: ["dark", "hover", "focus"],
  },
  plugins: [require("tailwindcss-dark-mode")()],
};
