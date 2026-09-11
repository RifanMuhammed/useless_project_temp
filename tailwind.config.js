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
        cyber: {
          bg: '#07090e',
          panel: '#0d111a',
          surface: '#131926',
          surfaceLight: '#1b2336',
          border: 'rgba(0, 255, 102, 0.2)',
          borderSubtle: 'rgba(255, 255, 255, 0.08)',
          green: '#00ff66',
          greenGlow: '#05f186',
          greenDark: '#003314',
          cyan: '#00f0ff',
          purple: '#8b5cf6',
          purpleGlow: '#a855f7',
          amber: '#f59e0b',
          crimson: '#ef4444',
          dimText: '#6b7280',
          hudMuted: '#94a3b8',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-green': '0 0 15px rgba(0, 255, 102, 0.35), 0 0 30px rgba(0, 255, 102, 0.15)',
        'neon-green-sm': '0 0 8px rgba(0, 255, 102, 0.4)',
        'neon-purple': '0 0 15px rgba(139, 92, 246, 0.4), 0 0 30px rgba(139, 92, 246, 0.2)',
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.35)',
        'panel': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'glitch': 'glitch 1s infinite',
        'corner-pulse': 'cornerPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        cornerPulse: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
