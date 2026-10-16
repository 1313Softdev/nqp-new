/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F4F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#6C5CE7', // Primary purple accent matching image
          700: '#5B4BC4',
          800: '#4C1D95',
          900: '#3B0764',
        },
        surface: {
          bg: '#F5F6FA',      // Soft grey-purple app background
          card: '#FFFFFF',    // Pure white cards
          sidebar: '#FFFFFF', // Sidebar background
          border: '#EAEBFE',  // Soft purple-tinted borders
          hover: '#F8F9FE',
        },
        newsText: {
          main: '#1A1D23',
          muted: '#687083',
          light: '#9CA3AF',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(108, 92, 231, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'hover': '0 12px 28px -4px rgba(108, 92, 231, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
