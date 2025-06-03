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
          DEFAULT: '#FF6B35', // warm orange
          hover: '#FF8C5A',
        },
        secondary: {
          DEFAULT: '#2E294E', // dark purple
          light: '#443C70',
        },
        background: {
          dark: '#1A1A2E',
          card: '#252541',
          light: '#2C2C44',
        },
        accent: {
          yellow: '#FFD700',
          green: '#36D399',
          blue: '#3B82F6',
          red: '#F87272',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B8B8D0',
          muted: '#8888A0',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.25)',
        hover: '0 10px 25px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
