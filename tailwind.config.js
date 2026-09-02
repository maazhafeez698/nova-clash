/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep-space base surfaces
        void: {
          DEFAULT: '#0F0B24',
          deep: '#0A0718',
          surface: '#1B1638',
          raised: '#241D4A',
          line: '#332B5E',
        },
        // Text
        ink: {
          DEFAULT: '#F1EDFF',
          muted: '#A79FD1',
          faint: '#726B99',
        },
        // Player factions
        amber: {
          DEFAULT: '#FFB454',
          soft: '#FFD9A0',
          dim: '#4A3722',
        },
        cyan: {
          DEFAULT: '#4CE0D2',
          soft: '#A6F2EA',
          dim: '#1E3A38',
        },
        // Accent / feedback
        nova: {
          DEFAULT: '#FF5C8A',
          soft: '#FFA6C1',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(76,224,210,0.25), 0 0 24px rgba(76,224,210,0.15)',
        'glow-amber': '0 0 0 1px rgba(255,180,84,0.25), 0 0 24px rgba(255,180,84,0.15)',
      },
      keyframes: {
        'mark-in': {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '60%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'line-draw': {
          '0%': { strokeDashoffset: '1' },
          '100%': { strokeDashoffset: '0' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'mark-in': 'mark-in 220ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        drift: 'drift 4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.2s ease-out infinite',
      },
    },
  },
  plugins: [],
}
