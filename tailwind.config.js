// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue', './node_modules/litepie-datepicker/**/*.js'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // Change with you want it
        'litepie-primary': colors.sky, // color system for light mode
        'litepie-secondary': colors.coolGray, // color system for dark mode
        blue: {
          50: '#4084ed',
          100: '#367ae3',
          200: '#2c70d9',
          300: '#2266cf',
          400: '#185cc5',
          500: '#0e52bb',
          600: '#0448b1',
          700: '#003ea7',
          800: '#00349d',
          900: '#002a93',
        },
      },
    },
  },
  variants: {
    extend: {
      cursor: ['disabled'],
      textOpacity: ['disabled'],
      textColor: ['disabled'],
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require('@tailwindcss/forms'),
  ],

};
