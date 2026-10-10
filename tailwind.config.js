/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0F14',
          950: '#070A0D',
          900: '#0B0F14',
          800: '#131A22',
          700: '#1C2530',
        },
        cream: {
          DEFAULT: '#FFF7EC',
          300: '#F6E9D8',
          200: '#EADCC6',
        },
        // Warm bun yellow, appetising chili red, fresh lettuce green.
        bun: { DEFAULT: '#F5A524', 400: '#FFC24B', 600: '#D98A12' },
        chili: { DEFAULT: '#E23E32', 400: '#FF6A3D', 600: '#C22A22' },
        lettuce: { DEFAULT: '#57A83D', 400: '#7CC24F' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        persian: ['Vazirmatn', '"Plus Jakarta Sans Variable"', 'ui-sans-serif', 'sans-serif'],
      },
      maxWidth: {
        shell: '1400px',
      },
      boxShadow: {
        glass: '0 30px 70px -40px rgba(0, 0, 0, 0.9)',
        accent: '0 18px 40px -16px rgba(226, 62, 50, 0.7)',
        'accent-hover': '0 24px 54px -16px rgba(255, 106, 61, 0.8)',
        badge: '0 8px 20px -8px rgba(226, 62, 50, 0.9)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
