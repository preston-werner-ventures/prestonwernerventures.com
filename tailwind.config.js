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
        "8": "32rem",
        "9": "36rem",
        "10": "40rem"
      }
    }
  },
  variants: {},
  plugins: []
};
