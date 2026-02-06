import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stardew Valley inspired pixel art palette
        background: '#1a1520',
        surface: {
          DEFAULT: '#2d2436',
          elevated: '#3d3346',
        },
        // Pixel art accent colors - vibrant game-like tones
        pixel: {
          gold: '#f7d359',
          goldDark: '#c9a227',
          green: '#7bc74d',
          greenDark: '#4a8c2a',
          blue: '#6dc2f2',
          blueDark: '#3d8cc2',
          red: '#e85d5d',
          redDark: '#a83232',
          orange: '#f5a442',
          purple: '#b57edc',
          cream: '#ffecd2',
          brown: '#9e7463',
        },
        // Border colors for pixel effects
        border: {
          DEFAULT: '#4a3f54',
          light: '#6b5a7a',
          pixel: '#1a1520',
        },
        // Semantic colors
        accent: {
          DEFAULT: '#f7d359',
          hover: '#ffd93d',
          muted: 'rgba(247, 211, 89, 0.1)',
        },
        success: '#7bc74d',
        warning: '#f5a442',
        error: '#e85d5d',
        // Text colors - warm cream tones
        text: {
          primary: '#ffecd2',
          secondary: '#d4a373',
          muted: '#9e7463',
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
        // Pixel-specific animations
        'pixel-bounce': 'pixelBounce 0.5s steps(4) infinite',
        'pixel-float': 'pixelFloat 2s steps(8) infinite',
        'pixel-shake': 'pixelShake 0.3s steps(4)',
        'pixel-press': 'pixelPress 0.1s steps(2)',
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
        // Stardew-style stepped animations
        pixelBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        pixelFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(-4px)' },
          '75%': { transform: 'translateY(-2px)' },
        },
        pixelShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '50%': { transform: 'translateX(2px)' },
          '75%': { transform: 'translateX(-2px)' },
        },
        pixelPress: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(4px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
