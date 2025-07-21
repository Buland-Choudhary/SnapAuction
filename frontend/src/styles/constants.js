// Design System Constants for SnapAuction
// These constants ensure consistency across the application

// Color Constants
export const COLORS = {
  // Primary colors
  PRIMARY_50: '#eff6ff',
  PRIMARY_100: '#dbeafe',
  PRIMARY_200: '#bfdbfe',
  PRIMARY_300: '#93c5fd',
  PRIMARY_400: '#60a5fa',
  PRIMARY_500: '#3b82f6',
  PRIMARY_600: '#2563eb',
  PRIMARY_700: '#1d4ed8',
  PRIMARY_800: '#1e40af',
  PRIMARY_900: '#1e3a8a',
  PRIMARY_950: '#172554',

  // Secondary colors
  SECONDARY_50: '#f0fdf4',
  SECONDARY_100: '#dcfce7',
  SECONDARY_200: '#bbf7d0',
  SECONDARY_300: '#86efac',
  SECONDARY_400: '#4ade80',
  SECONDARY_500: '#22c55e',
  SECONDARY_600: '#16a34a',
  SECONDARY_700: '#15803d',
  SECONDARY_800: '#166534',
  SECONDARY_900: '#14532d',

  // Status colors
  SUCCESS: '#22c55e',
  WARNING: '#eab308',
  ERROR: '#ef4444',
  INFO: '#3b82f6',

  // Neutral colors
  WHITE: '#ffffff',
  GRAY_50: '#fafafa',
  GRAY_100: '#f5f5f5',
  GRAY_200: '#e5e5e5',
  GRAY_300: '#d4d4d4',
  GRAY_400: '#a3a3a3',
  GRAY_500: '#737373',
  GRAY_600: '#525252',
  GRAY_700: '#404040',
  GRAY_800: '#262626',
  GRAY_900: '#171717',
  BLACK: '#000000',
};

// Typography Constants
export const TYPOGRAPHY = {
  FONT_FAMILY: {
    PRIMARY: 'Inter, ui-sans-serif, system-ui, sans-serif',
    DISPLAY: 'Poppins, ui-sans-serif, system-ui, sans-serif',
    MONO: 'ui-monospace, SFMono-Regular, monospace',
  },
  
  FONT_SIZE: {
    XS: '0.75rem',    // 12px
    SM: '0.875rem',   // 14px
    BASE: '1rem',     // 16px
    LG: '1.125rem',   // 18px
    XL: '1.25rem',    // 20px
    '2XL': '1.5rem',  // 24px
    '3XL': '1.875rem', // 30px
    '4XL': '2.25rem', // 36px
    '5XL': '3rem',    // 48px
    '6XL': '3.75rem', // 60px
  },
  
  FONT_WEIGHT: {
    LIGHT: '300',
    NORMAL: '400',
    MEDIUM: '500',
    SEMIBOLD: '600',
    BOLD: '700',
    EXTRABOLD: '800',
  },
  
  LINE_HEIGHT: {
    TIGHT: '1.25',
    NORMAL: '1.5',
    RELAXED: '1.75',
  },
};

// Spacing Constants (based on 4px grid)
export const SPACING = {
  XS: '0.25rem',   // 4px
  SM: '0.5rem',    // 8px
  MD: '0.75rem',   // 12px
  LG: '1rem',      // 16px
  XL: '1.5rem',    // 24px
  '2XL': '2rem',   // 32px
  '3XL': '3rem',   // 48px
  '4XL': '4rem',   // 64px
  '5XL': '6rem',   // 96px
  '6XL': '8rem',   // 128px
};

// Border Radius Constants
export const BORDER_RADIUS = {
  NONE: '0',
  SM: '0.125rem',   // 2px
  BASE: '0.25rem',  // 4px
  MD: '0.375rem',   // 6px
  LG: '0.5rem',     // 8px
  XL: '0.75rem',    // 12px
  '2XL': '1rem',    // 16px
  '3XL': '1.5rem',  // 24px
  FULL: '9999px',
};

// Shadow Constants
export const SHADOWS = {
  XS: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  SM: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  BASE: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  MD: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  LG: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  XL: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2XL': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  GLOW: '0 0 20px rgb(59 130 246 / 0.5)',
};

// Transition Constants
export const TRANSITIONS = {
  FAST: '150ms ease-in-out',
  BASE: '300ms ease-in-out',
  SLOW: '500ms ease-in-out',
};

// Z-Index Constants
export const Z_INDEX = {
  DROPDOWN: 10,
  STICKY: 20,
  FIXED: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  POPOVER: 60,
  TOOLTIP: 70,
  NOTIFICATION: 80,
};

// Breakpoint Constants
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
};

// Component Size Constants
export const COMPONENT_SIZES = {
  BUTTON: {
    XS: { padding: '0.25rem 0.625rem', fontSize: '0.75rem' },
    SM: { padding: '0.5rem 0.75rem', fontSize: '0.875rem' },
    MD: { padding: '0.625rem 1rem', fontSize: '0.875rem' },
    LG: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    XL: { padding: '1rem 2rem', fontSize: '1.125rem' },
  },
  
  INPUT: {
    SM: { padding: '0.5rem 0.75rem', fontSize: '0.875rem' },
    MD: { padding: '0.625rem 1rem', fontSize: '1rem' },
    LG: { padding: '0.75rem 1.25rem', fontSize: '1.125rem' },
  },
  
  CARD: {
    SM: { padding: '0.75rem' },
    MD: { padding: '1rem' },
    LG: { padding: '1.5rem' },
    XL: { padding: '2rem' },
  },
};

// Auction Status Constants
export const AUCTION_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  ENDED: 'ended',
};

export const AUCTION_STATUS_COLORS = {
  [AUCTION_STATUS.UPCOMING]: {
    bg: 'bg-warning-500',
    text: 'text-warning-900',
    border: 'border-warning-500',
  },
  [AUCTION_STATUS.LIVE]: {
    bg: 'bg-success-500',
    text: 'text-success-900',
    border: 'border-success-500',
  },
  [AUCTION_STATUS.ENDED]: {
    bg: 'bg-neutral-500',
    text: 'text-neutral-900',
    border: 'border-neutral-500',
  },
};

// Layout Constants
export const LAYOUT = {
  NAVBAR_HEIGHT: '4rem',
  SIDEBAR_WIDTH: '16rem',
  CONTAINER_MAX_WIDTH: '1280px',
  CONTENT_PADDING: '1.5rem',
};

// Animation Duration Constants
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Common CSS Class Combinations
export const CSS_CLASSES = {
  // Button variations
  BUTTON_PRIMARY: 'bg-primary-600 hover:bg-primary-700 text-white',
  BUTTON_SECONDARY: 'bg-secondary-600 hover:bg-secondary-700 text-white',
  BUTTON_OUTLINE: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
  BUTTON_GHOST: 'text-primary-600 hover:bg-primary-50',
  BUTTON_DANGER: 'bg-error-600 hover:bg-error-700 text-white',
  
  // Card variations
  CARD_DEFAULT: 'bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow',
  CARD_ELEVATED: 'bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow',
  CARD_FLAT: 'bg-white rounded-xl border border-neutral-200',
  
  // Input variations
  INPUT_DEFAULT: 'border border-neutral-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500',
  INPUT_ERROR: 'border-error-500 focus:ring-error-500',
  INPUT_SUCCESS: 'border-success-500 focus:ring-success-500',
  
  // Text variations
  TEXT_HEADING: 'font-display font-semibold text-neutral-900',
  TEXT_BODY: 'font-sans text-neutral-700',
  TEXT_CAPTION: 'font-sans text-sm text-neutral-500',
  TEXT_LINK: 'text-primary-600 hover:text-primary-700 hover:underline',
  
  // Layout utilities
  FLEX_CENTER: 'flex items-center justify-center',
  FLEX_BETWEEN: 'flex items-center justify-between',
  GRID_RESPONSIVE: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
  CONTAINER: 'max-w-6xl mx-auto px-6',
};

// Export all constants as a single object for easier importing
export const DESIGN_SYSTEM = {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TRANSITIONS,
  Z_INDEX,
  BREAKPOINTS,
  COMPONENT_SIZES,
  AUCTION_STATUS,
  AUCTION_STATUS_COLORS,
  LAYOUT,
  ANIMATION_DURATION,
  CSS_CLASSES,
};

export default DESIGN_SYSTEM;
