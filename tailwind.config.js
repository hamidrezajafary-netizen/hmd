/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1C33',
          950: '#061223',
          900: '#081527',
          800: '#0E2440',
          700: '#16304F',
          600: '#26476B',
        },
        champagne: {
          DEFAULT: '#C5A06F',
          400: '#D2B489',
          300: '#DDC6A2',
          200: '#EBDCC4',
          100: '#F5EDE0',
        },
        ivory: '#FAF8F5',
        warm: '#F4F1EC',
        ink: '#0B1C33',
        muted: '#5C6B7E',
        hairline: '#E7E4DE',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        shell: '1320px',
      },
      borderRadius: {
        xl2: '14px',
      },
      boxShadow: {
        soft: '0 18px 45px -28px rgba(11, 28, 51, 0.45)',
        card: '0 26px 60px -34px rgba(11, 28, 51, 0.5)',
        lift: '0 34px 70px -32px rgba(11, 28, 51, 0.55)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
