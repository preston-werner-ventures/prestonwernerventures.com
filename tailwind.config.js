/* See https://tailwindcss.com/docs/configuration for more options */

module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          "100": "#F0F2FA",
          "200": "#D5DDF1",
          "300": "#BAC7E8",
          "400": "#889ED8",
          "500": "#627ECB",
          "600": "#4769C2",
          "700": "#334F99",
          "800": "#273D77",
          "900": "#1B2A52"
        },
        red: {
          "100": "#FCF3F3",
          "200": "#F8E3E3",
          "300": "#F2CFCF",
          "400": "#ECB7B6",
          "500": "#E49B9A",
          "600": "#DE8382",
          "700": "#D76766",
          "800": "#D15351",
          "900": "#CB3C3A"
        }
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        serif: ["Roboto Slab", "serif"]
      },
      minHeight: {
        "3": "12rem",
        "4": "16rem",
        "8": "32rem",
        "9": "36rem",
        "10": "40rem",
      },
      maxHeight: {
        "24": "6rem",
        "64": "16rem",
        "128": "32rem"
      },
      spacing: {
        half: "0.125rem",
        "2/3": "66.666667%"
      },
      width: {
        "36": "9rem",
        "52": "13rem"
      }
    }
  },
  variants: {},
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        ".break-slice": {
          boxDecorationBreak: "slice"
        },
        ".break-clone": {
          boxDecorationBreak: "clone"
        }
      };

      addUtilities(newUtilities);
    }
  ]
};
