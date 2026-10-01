/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./Ai insights/**/*.{js,ts,jsx,tsx}",
    "./activity analysis/**/*.{js,ts,jsx,tsx}",
    "./dashboard/**/*.{js,ts,jsx,tsx}",
    "./people and participants/**/*.{js,ts,jsx,tsx}",
    "./relationship insight/**/*.{js,ts,jsx,tsx}",
    "./smart search/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C5CFF', // Lavender
          light: '#B19FFF',
        },
        secondary: {
          DEFAULT: '#00A3FF', // Sky Blue
          bg: '#E0F2FE',
        },
        accent: {
          pink: '#FF6B9D', // Soft Pink
          'pink-light': '#FFA2C6',
        },
        mint: {
          DEFAULT: '#10B981', // Mint Green
          light: '#A7F3D0',
        },
        orange: {
          DEFAULT: '#FF9F43', // Light Orange
          light: '#FFE3C8',
        },
        neutralBg: '#F8FAFC',
        textMain: '#1E293B',
        textMuted: '#64748B',
        textLight: '#94A3B8',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 10px 30px -10px rgba(124, 92, 255, 0.06), 0 1px 1px 0 rgba(255, 255, 255, 0.8) inset',
        'glass-hover': '0 20px 40px -10px rgba(124, 92, 255, 0.12), 0 1px 1px 0 rgba(255, 255, 255, 0.9) inset',
        sidebar: '4px 0 30px rgba(0, 0, 0, 0.01)',
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
