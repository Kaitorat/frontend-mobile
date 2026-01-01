const { hairlineWidth } = require('nativewind/theme');

// Colores del tema Persona 5 Royal - valores directos para compatibilidad móvil
const COLORS = {
  // Light theme
  light: {
    background: '#FFFFFF',
    foreground: '#0A0A0A',
    card: '#FFFFFF',
    cardForeground: '#0A0A0A',
    popover: '#FFFFFF',
    popoverForeground: '#0A0A0A',
    primary: '#E61B23',
    primaryForeground: '#FFFFFF',
    secondary: '#F5F5F5',
    secondaryForeground: '#171717',
    muted: '#F5F5F5',
    mutedForeground: '#737373',
    accent: '#FACC15',
    accentForeground: '#171717',
    destructive: '#E61B23',
    destructiveForeground: '#FAFAFA',
    border: '#E5E5E5',
    input: '#E5E5E5',
    ring: '#E61B23',
  },
  // Dark theme (Persona 5 default)
  dark: {
    background: '#0A0A0A',
    foreground: '#FAFAFA',
    card: '#18181B',
    cardForeground: '#FAFAFA',
    popover: '#18181B',
    popoverForeground: '#FAFAFA',
    primary: '#E61B23',
    primaryForeground: '#FFFFFF',
    secondary: '#27272A',
    secondaryForeground: '#FAFAFA',
    muted: '#27272A',
    mutedForeground: '#A1A1AA',
    accent: '#FACC15',
    accentForeground: '#171717',
    destructive: '#7F1D1D',
    destructiveForeground: '#FAFAFA',
    border: '#3F3F46',
    input: '#3F3F46',
    ring: '#E61B23',
  },
};

// Usar dark theme como default (estilo P5)
const theme = COLORS.dark;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Anton', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: theme.border,
        input: theme.input,
        ring: theme.ring,
        background: theme.background,
        foreground: theme.foreground,
        primary: {
          DEFAULT: theme.primary,
          foreground: theme.primaryForeground,
        },
        secondary: {
          DEFAULT: theme.secondary,
          foreground: theme.secondaryForeground,
        },
        destructive: {
          DEFAULT: theme.destructive,
          foreground: theme.destructiveForeground,
        },
        muted: {
          DEFAULT: theme.muted,
          foreground: theme.mutedForeground,
        },
        accent: {
          DEFAULT: theme.accent,
          foreground: theme.accentForeground,
        },
        popover: {
          DEFAULT: theme.popover,
          foreground: theme.popoverForeground,
        },
        card: {
          DEFAULT: theme.card,
          foreground: theme.cardForeground,
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};