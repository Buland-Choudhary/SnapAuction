// SnapAuction Design System Theme Configuration
export const theme = {
  // Color Palette
  colors: {
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1e40af',
      darker: '#172554',
    },
    secondary: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    status: {
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      info: '#3b82f6',
    },
    neutral: {
      white: '#ffffff',
      gray50: '#fafafa',
      gray100: '#f5f5f5',
      gray200: '#e5e5e5',
      gray300: '#d4d4d4',
      gray400: '#a3a3a3',
      gray500: '#737373',
      gray600: '#525252',
      gray700: '#404040',
      gray800: '#262626',
      gray900: '#171717',
      black: '#000000',
    },
  },

  // Typography System
  typography: {
    fontFamily: {
      primary: 'Inter, ui-sans-serif, system-ui, sans-serif',
      display: 'Poppins, ui-sans-serif, system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // Spacing System (based on 4px grid)
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    '3xl': '3rem',   // 48px
    '4xl': '4rem',   // 64px
    '5xl': '6rem',   // 96px
    '6xl': '8rem',   // 128px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    glow: '0 0 20px rgb(59 130 246 / 0.5)',
  },

  // Component Variants
  components: {
    button: {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white',
      secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white',
      outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
      ghost: 'text-primary-600 hover:bg-primary-50',
      danger: 'bg-error-600 hover:bg-error-700 text-white',
    },
    card: {
      base: 'bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow',
      elevated: 'bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow',
      glass: 'glass rounded-xl',
    },
    input: {
      base: 'border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
      error: 'border-error-500 focus:ring-error-500',
      success: 'border-success-500 focus:ring-success-500',
    },
    badge: {
      primary: 'bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium',
      secondary: 'bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full text-xs font-medium',
      success: 'bg-success-100 text-success-800 px-2 py-1 rounded-full text-xs font-medium',
      warning: 'bg-warning-100 text-warning-800 px-2 py-1 rounded-full text-xs font-medium',
      error: 'bg-error-100 text-error-800 px-2 py-1 rounded-full text-xs font-medium',
      gray: 'bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full text-xs font-medium',
    },
  },

  // Breakpoints (Tailwind defaults)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },

  // Z-Index Scale
  zIndex: {
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
    notification: 80,
  },
};

// Status color mappings for auction states
export const auctionStatusColors = {
  upcoming: {
    bg: 'bg-warning-500',
    text: 'text-warning-900',
    border: 'border-warning-500',
    badge: theme.components.badge.warning,
  },
  live: {
    bg: 'bg-success-500',
    text: 'text-success-900',
    border: 'border-success-500',
    badge: theme.components.badge.success,
  },
  ended: {
    bg: 'bg-neutral-500',
    text: 'text-neutral-900',
    border: 'border-neutral-500',
    badge: theme.components.badge.gray,
  },
};

// Gradient configurations
export const gradients = {
  primary: 'bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800',
  secondary: 'bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-700',
  sunset: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
  ocean: 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700',
  aurora: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600',
};

// Common layout configurations
export const layouts = {
  container: {
    sm: 'max-w-3xl mx-auto px-4',
    md: 'max-w-4xl mx-auto px-6',
    lg: 'max-w-6xl mx-auto px-6',
    xl: 'max-w-7xl mx-auto px-8',
  },
  grid: {
    responsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
    dense: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
  },
};

export default theme;
