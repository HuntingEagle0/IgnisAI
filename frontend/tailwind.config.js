/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ignis: {
          bg: '#080c14',
          surface: '#0d1524',
          card: '#111d32',
          cardHover: '#162540',
          border: '#1e3050',
          borderLight: '#2a436e',
          cyan: '#06b6d4',
          cyanGlow: '#22d3ee',
          industrial: '#ef4444',
          vegetation: '#10b981',
          warning: '#f59e0b',
          muted: '#64748b',
          text: '#e2e8f0',
          textMuted: '#94a3b8'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
