const materialPalette = require("./materialPalette.js");

module.exports = {
  corePlugins: {
    borderOpacity: false,
  },
  darkMode: "class", // or 'media' or 'class'
  purge: {
    content: ["./public/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  },
  theme: {
    maxHeight: {
      "0": "0",
      full: "100%",
      screen: "100vh",
    },
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
      width: {
        "max-content": "max-content",
      },
      height: {
        "3/4": "75%",
      },
      transitionProperty: {
        height: "height",
        "max-height": "max-height",
        button: "background-color, margin",
        borderColor: "border-color",
        nav: "height, padding",
        bubblemenu: "opacity, visibility",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["dark", "hover", "focus"],
      textColor: ["dark"],
      borderColor: ["dark", "hover", "focus"],
    },
  },
  plugins: [],
};
