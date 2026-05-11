/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5B21B6',
          50: '#faf5ff',
          100: '#f3e8ff',
          900: '#5B21B6',
        },
        secondary: '#353638',
        input: {
          border: '#AFADD4',
          text: '#8390A2',
          label: '#3B3B3B',
          background: '#ffffff',
        },
        dark: {
          text: '#3C3C3C',
          light: '#474A5F',
        },
        gray: {
          light: '#F3F3F3',
          border: '#AFADD4',
        },
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['20px', { lineHeight: '28px' }],
        xl: ['24px', { lineHeight: '32px' }],
        '2xl': ['31px', { lineHeight: '42px' }],
        '3xl': ['33px', { lineHeight: '42px' }],
      },
      borderRadius: {
        input: '8px',
        tab: '25px',
        container: '20px',
      },
    },
  },
  plugins: [],
}
