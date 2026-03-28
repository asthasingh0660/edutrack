/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F5F2EA',
          dark:    '#EDE8DA',
          border:  '#D9D3C0',
        },
        ink: {
          DEFAULT: '#1A1A14',
        },
        forest: {
          DEFAULT: '#2D6A4F',
          mid:     '#52B788',
          light:   '#D8F3DC',
          pale:    '#EEF8F0',
        },
        gold: {
          DEFAULT: '#E9C46A',
          dark:    '#C4973A',
          pale:    '#FEF9EC',
        },
        coral: {
          DEFAULT: '#E63946',
          pale:    '#FDECEA',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:  ['"DM Mono"', 'monospace'],
      },
      borderRadius: {
        pill: '99px',
      },
    },
  },
  plugins: [],
}