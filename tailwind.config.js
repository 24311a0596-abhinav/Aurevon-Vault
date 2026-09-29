/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { primary: '#DEDBC8', ink: '#0a0a0a' },
    fontFamily: { serif: ['"Instrument Serif"', 'serif'] },
    keyframes: { drift: { '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' }, '50%': { transform: 'translate3d(6%,-4%,0) scale(1.15)' } } },
    animation: { drift: 'drift 22s ease-in-out infinite' },
  } },
  plugins: [],
};
