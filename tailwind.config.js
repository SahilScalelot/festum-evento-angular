/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: ["./src/**/*.{html,ts,scss}",],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '2k': '1920px',
      '4k': '2560px',
    },
    fontFamily: {
      primary: ['Helvetica', 'sans-serif']
    },
    extend: {
      fontSize: {
        '10': ['0.625rem', '0.75rem'],
        '13': ['0.813rem', '1rem'],
        '26': ['1.625rem', '2rem'],
        '40': ['2.5rem', '2.5rem'],
      },
      colors: {
        brightGray: '#eeeeee',     // gray
        japaneseIndigo: '#25364F', // dark
        quicksilver: '#9BA6A8',    // light-gray
        magicPotion: '#FE4D5F',    // red
        caribbeanGreen: '#13E1B0', // green
        ev: {
          dark: {
            DEFAULT: '#25364F',
          },
          red: {
            DEFAULT: '#FE4D5F',
          },
          gray: '#A6A6A6',
        },
      },
      boxShadow: {
        'shadow': '0px 0px 10px rgba(0, 0, 0, 0.09)',
      },
      boxShadow: {
        '3xl': '0px 0px 5px rgba(0, 0, 0, 0.1)',
        'red': '0px 0px 1px 2px #FE4D5F',
        'black': '0px 0px 1px 2px rgba(36, 36, 39, 0.6)',
      }
    },
  },
  plugins: [
    require("postcss-import"),
    require("tailwindcss"),
    require("autoprefixer"),
  ],
}

