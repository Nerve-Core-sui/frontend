import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // NerveCore Mini App — Dark Purple Pixel Palette
        background: '#1a1525',
        surface: {
          DEFAULT: '#2d2438',
          elevated: '#3d3450',
          deep: '#140f1e',
        },
        // Pixel art accent colors
        pixel: {
          lime: '#84cc16',
          limeDark: '#65a30d',
          limeGlow: '#a3e635',
          gold: '#eab308',
          goldDark: '#ca8a04',
          goldLight: '#facc15',
          blue: '#6dc2f2',
          blueDark: '#3d8cc2',
          red: '#ef4444',
          redDark: '#b91c1c',
          orange: '#f59e0b',
          purple: '#a855f7',
          purpleDark: '#7e22ce',
          cream: '#fef3c7',
          pink: '#f472b6',
        },
        // Border colors
        border: {
          DEFAULT: '#4a3f5c',
          light: '#6b5a80',
          pixel: '#0d0a14',
          lime: '#84cc16',
        },
        // Semantic
        accent: {
          DEFAULT: '#eab308',
          hover: '#facc15',
          muted: 'rgba(234, 179, 8, 0.12)',
        },
        success: '#84cc16',
        warning: '#f59e0b',
        error: '#ef4444',
        // Text colors
        text: {
          primary: '#f5f5f4',
          secondary: '#a8a29e',
          muted: '#6b6561',
          lime: '#84cc16',
          gold: '#eab308',
        },
      },
      fontFamily: {
        // Pixel fonts for authentic retro feel
        pixel: ['var(--font-pixel)', 'monospace'],
        'pixel-body': ['var(--font-pixel-body)', 'monospace'],
        sans: ['var(--font-pixel-body)', 'monospace'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      borderRadius: {
        'pixel': '0px',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        // Pixel-style shadows using box-shadow technique
        'pixel': '4px 4px 0px 0px #1a1520',
        'pixel-sm': '2px 2px 0px 0px #1a1520',
        'pixel-lg': '6px 6px 0px 0px #1a1520',
        'pixel-gold': '4px 4px 0px 0px #c9a227',
        'pixel-green': '4px 4px 0px 0px #4a8c2a',
        'pixel-inset': 'inset 2px 2px 0px 0px rgba(0,0,0,0.3)',
        'card': '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.4)',
        'sheet': '0 -4px 20px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
        'pixel-bounce': 'pixelBounce 0.6s steps(6) infinite',
        'pixel-float': 'pixelFloat 3s steps(8) infinite',
        'pixel-shake': 'pixelShake 0.3s steps(4)',
        'pixel-press': 'pixelPress 0.1s steps(2)',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        pixelBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pixelFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-3px)' },
          '50%': { transform: 'translateY(-6px)' },
          '75%': { transform: 'translateY(-3px)' },
        },
        pixelShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '50%': { transform: 'translateX(3px)' },
          '75%': { transform: 'translateX(-3px)' },
        },
        pixelPress: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(4px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(132, 204, 22, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(132, 204, 22, 0.6)' },
        },
        scanline: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
