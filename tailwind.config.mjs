export default {
  purge: ['./app/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#805AD5',
          600: '#6B46C1',
        },
        blue: {
          500: '#4299E1',
          600: '#3182CE',
        },
        green: {
          500: '#48BB78',
          600: '#38A169',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
