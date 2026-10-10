/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm near-black: the restaurant interior, and every scrim over the video.
        ink: {
          DEFAULT: '#0A0B0E',
          950: '#060709',
          900: '#0A0B0E',
          800: '#14171D',
          700: '#1F232B',
        },
        cream: {
          DEFAULT: '#FFF6EA',
          300: '#F1E3CE',
          200: '#DCC9AC',
        },
        // Burger King brand fire: ember red, flame orange, crown gold.
        ember: { DEFAULT: '#D62300', 500: '#E8452A', 400: '#FF6A3D' },
        flame: { DEFAULT: '#FF8732', 400: '#FFA95C' },
        gold: { DEFAULT: '#FFC72C', 400: '#FFD75E' },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans Variable"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        display: ['"Archivo Black"', '"Plus Jakarta Sans Variable"', 'ui-sans-serif', 'sans-serif'],
      },
      maxWidth: {
        shell: '1400px',
      },
      boxShadow: {
        glass: '0 30px 70px -40px rgba(0, 0, 0, 0.95)',
        ember: '0 18px 40px -16px rgba(214, 35, 0, 0.75)',
        'ember-hover': '0 26px 56px -16px rgba(255, 106, 61, 0.85)',
        hotspot: '0 24px 60px -28px rgba(255, 135, 50, 0.75)',
        sheet: '0 -30px 80px -30px rgba(0, 0, 0, 0.95)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        'cue-dot': {
          '0%': { transform: 'translateY(-6px)', opacity: '0' },
          '18%': { opacity: '1' },
          '82%': { opacity: '1' },
          '100%': { transform: 'translateY(34px)', opacity: '0' },
        },
        'cue-breathe': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.86)', opacity: '0' },
          '60%': { transform: 'scale(1.06)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'sheet-in': {
          '0%': { transform: 'translateY(18px) scale(0.98)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
      },
      animation: {
        'cue-dot': 'cue-dot 2.1s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'cue-breathe': 'cue-breathe 2.6s ease-in-out infinite',
        'pop-in': 'pop-in 320ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'sheet-in': 'sheet-in 260ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
