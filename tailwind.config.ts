import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-void':    '#050505',
        'bg-dark':    '#0D0D0D',
        'bg-card':    '#111111',
        'bg-surface': '#1A1A1A',
        // Gold
        'gold-pure':    '#C9A84C',
        'gold-light':   '#E8C97A',
        'gold-dark':    '#8B6914',
        'gold-muted':   '#6B5420',
        'gold-shimmer': '#F5E6B8',
        // Text
        'text-cream':   '#F0E6D3',
        'text-secondary': '#9A8A70',
        'text-muted':   '#5C5040',
        // Accents
        'accent-crimson': '#8B1A1A',
        'accent-silver':  '#8A9BA8',
        // WhatsApp
        'whatsapp':       '#128C7E',
        'whatsapp-light': '#25D366',
      },
      fontFamily: {
        cinzel:    ['var(--font-cinzel)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        cairo:     ['var(--font-cairo)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold':  'linear-gradient(135deg, #C9A84C, #E8C97A, #C9A84C)',
        'gradient-dark':  'linear-gradient(180deg, #0D0D0D 0%, #050505 100%)',
        'gradient-card':  'linear-gradient(145deg, #1A1A1A, #111111)',
        'gradient-hero':  'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.15) 0%, transparent 70%)',
        'gradient-radial-gold': 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)',
      },
      boxShadow: {
        'gold-sm':  '0 0 15px rgba(201, 168, 76, 0.2)',
        'gold-md':  '0 0 30px rgba(201, 168, 76, 0.3)',
        'gold-lg':  '0 0 60px rgba(201, 168, 76, 0.4)',
        'card':     '0 4px 24px rgba(0,0,0,0.6)',
        'card-hover': '0 8px 48px rgba(0,0,0,0.8)',
      },
      borderColor: {
        'gold': 'rgba(201, 168, 76, 0.3)',
        'gold-strong': 'rgba(201, 168, 76, 0.6)',
        'subtle': 'rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'shimmer':       'shimmer 2.5s linear infinite',
        'gold-pulse':    'goldPulse 3s ease-in-out infinite',
        'float':         'float 6s ease-in-out infinite',
        'float-slow':    'float 10s ease-in-out infinite',
        'fade-up':       'fadeUp 0.6s ease-out forwards',
        'spin-slow':     'spin 8s linear infinite',
        'marquee':       'marquee 30s linear infinite',
        'count-up':      'countUp 0.3s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        goldPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(201,168,76,0.2)' },
          '50%':      { boxShadow: '0 0 40px rgba(201,168,76,0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
      screens: {
        'sm':  '640px',
        'md':  '768px',
        'lg':  '1024px',
        'xl':  '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

export default config
