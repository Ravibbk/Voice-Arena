/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Primary Accent
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        research: {
          emerald: '#059669', // Real Run Green
          slateLight: '#F8FAFC',
          borderLight: '#E2E8F0',
          borderDark: '#1E293B',
          bgDark: '#0B0F19',
          cardDark: '#111827',
        }
      }
    },
  },
  plugins: [],
}
