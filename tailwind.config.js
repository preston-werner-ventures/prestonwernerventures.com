/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./code/**/*.{html,js}'],
  theme: {
    fontFamily: {
      sans: ['Source Sans Pro', 'sans-serif'],
      display: ['Bebas Neue', 'sans-serif'],
    },
    extend: {
      minHeight: {
        3: '12rem',
        4: '16rem',
        8: '32rem',
        9: '36rem',
        10: '40rem',
      },
      maxHeight: {
        24: '6rem',
        64: '16rem',
        128: '32rem',
      },
      spacing: {
        half: '0.125rem',
        '2/3': '66.666667%',
      },
      width: {
        36: '9rem',
        52: '13rem',
      },
    },
  },
  plugins: [],
}
