import theme from 'tailwindcss/defaultTheme'

const config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...theme.fontFamily.sans],
      },
    },
  },
  content: [
    '.src/app/**/*.{ts,tsx}',
    '.src/components/**/*.{ts,tsx}',
    '.src/pages/**/*.{ts,tsx}',
  ],
  plugins: [],
}

export default config