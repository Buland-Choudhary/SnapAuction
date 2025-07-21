// Component Style Utilities for SnapAuction Design System

// Button component styles
export const buttonStyles = {
  // Base button styles
  base: 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Size variants
  sizes: {
    xs: 'px-2.5 py-1.5 text-xs rounded-md',
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-xl',
  },
  
  // Color variants
  variants: {
    primary: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-md hover:shadow-lg focus:ring-primary-500',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 active:bg-secondary-800 text-white shadow-md hover:shadow-lg focus:ring-secondary-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500',
    danger: 'bg-error-600 hover:bg-error-700 active:bg-error-800 text-white shadow-md hover:shadow-lg focus:ring-error-500',
    success: 'bg-success-600 hover:bg-success-700 active:bg-success-800 text-white shadow-md hover:shadow-lg focus:ring-success-500',
    warning: 'bg-warning-500 hover:bg-warning-600 active:bg-warning-700 text-white shadow-md hover:shadow-lg focus:ring-warning-500',
  },
};

// Card component styles
export const cardStyles = {
  base: 'bg-white rounded-xl transition-all duration-300',
  
  variants: {
    default: 'shadow-md hover:shadow-lg',
    elevated: 'shadow-lg hover:shadow-xl',
    flat: 'border border-neutral-200',
    glass: 'glass backdrop-blur-lg',
    glow: 'shadow-glow hover:shadow-glow-lg',
  },
  
  padding: {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },
};

// Input component styles
export const inputStyles = {
  base: 'w-full transition-all duration-300 focus:outline-none',
  
  variants: {
    default: 'border border-neutral-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    filled: 'bg-neutral-100 border-0 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:bg-white',
    underlined: 'border-0 border-b-2 border-neutral-300 rounded-none px-0 py-2 focus:border-primary-500',
  },
  
  states: {
    error: 'border-error-500 focus:ring-error-500 focus:border-error-500',
    success: 'border-success-500 focus:ring-success-500 focus:border-success-500',
    disabled: 'bg-neutral-100 text-neutral-400 cursor-not-allowed',
  },
  
  sizes: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  },
};

// Badge component styles
export const badgeStyles = {
  base: 'inline-flex items-center font-medium rounded-full transition-all duration-300',
  
  sizes: {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm',
  },
  
  variants: {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    gray: 'bg-neutral-100 text-neutral-800',
    dark: 'bg-neutral-800 text-neutral-100',
  },
};

// Layout utilities
export const layoutStyles = {
  container: {
    sm: 'max-w-3xl mx-auto px-4',
    md: 'max-w-4xl mx-auto px-6',
    lg: 'max-w-6xl mx-auto px-6',
    xl: 'max-w-7xl mx-auto px-8',
    full: 'w-full px-4 sm:px-6 lg:px-8',
  },
  
  grid: {
    responsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
    dense: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
    auction: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  },
  
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center',
  },
};

// Animation classes
export const animationStyles = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  bounce: 'animate-bounce-gentle',
  pulse: 'animate-pulse-slow',
  glow: 'animate-glow',
  
  hover: {
    scale: 'hover:scale-105 transition-transform duration-300',
    lift: 'hover:-translate-y-1 transition-transform duration-300',
    glow: 'hover:shadow-glow transition-shadow duration-300',
  },
};

// Gradient backgrounds
export const gradientStyles = {
  primary: 'bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800',
  secondary: 'bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-700',
  sunset: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
  ocean: 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700',
  aurora: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600',
  dark: 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700',
};

// Utility functions for combining styles
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Generate button classes
export const getButtonClasses = (variant = 'primary', size = 'md', disabled = false) => {
  return cn(
    buttonStyles.base,
    buttonStyles.sizes[size],
    buttonStyles.variants[variant],
    disabled && 'opacity-50 cursor-not-allowed'
  );
};

// Generate card classes
export const getCardClasses = (variant = 'default', padding = 'md') => {
  return cn(
    cardStyles.base,
    cardStyles.variants[variant],
    cardStyles.padding[padding]
  );
};

// Generate input classes
export const getInputClasses = (variant = 'default', size = 'md', state = null) => {
  return cn(
    inputStyles.base,
    inputStyles.variants[variant],
    inputStyles.sizes[size],
    state && inputStyles.states[state]
  );
};

// Generate badge classes
export const getBadgeClasses = (variant = 'primary', size = 'sm') => {
  return cn(
    badgeStyles.base,
    badgeStyles.sizes[size],
    badgeStyles.variants[variant]
  );
};

// Auction status utilities
export const getAuctionStatusClasses = (status) => {
  const statusMap = {
    upcoming: 'bg-warning-500 text-white',
    live: 'bg-success-500 text-white',
    ended: 'bg-neutral-500 text-white',
  };
  
  return cn(
    badgeStyles.base,
    badgeStyles.sizes.sm,
    statusMap[status.toLowerCase()] || statusMap.ended
  );
};

// Enhanced auction component styles
export const auctionStyles = {
  // Auction card variants
  card: {
    base: 'bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100',
    interactive: 'hover:scale-[1.02] hover:-translate-y-2 cursor-pointer',
    featured: 'ring-2 ring-blue-500 ring-opacity-50',
  },
  
  // Image gallery styles
  gallery: {
    container: 'space-y-4',
    mainImage: 'aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-xl relative group',
    thumbnail: 'w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300',
    thumbnailActive: 'ring-4 ring-blue-500 shadow-lg scale-105',
    thumbnailInactive: 'hover:ring-2 hover:ring-blue-300 hover:scale-105 opacity-70 hover:opacity-100',
  },
  
  // Bid section styles
  bidSection: {
    container: 'space-y-6',
    currentPrice: 'text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200',
    priceDisplay: 'text-4xl font-bold text-blue-600 animate-pulse',
    bidForm: 'p-6 bg-white rounded-2xl border border-gray-200 shadow-sm',
    bidInput: 'w-full pl-10 pr-4 py-3 border rounded-xl text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
    bidButton: 'w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105',
    quickBidButton: 'p-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 border border-blue-200',
  },
  
  // Countdown timer styles
  countdown: {
    container: 'p-6 rounded-2xl border relative overflow-hidden',
    timeGrid: 'grid grid-cols-4 gap-3 mb-6',
    timeBox: 'bg-white rounded-xl p-3 shadow-sm border border-gray-200 transition-all duration-300',
    timeValue: 'text-2xl font-bold font-mono',
    progressBar: 'w-full bg-gray-200 rounded-full h-2 overflow-hidden progress-bar-animated',
    urgentBg: 'absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 animate-pulse',
  },
  
  // Status indicators
  status: {
    live: 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse',
    upcoming: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
    ended: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
    badge: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg',
  },
  
  // Animation classes
  animations: {
    bidUpdate: 'animate-bid-update',
    slideDown: 'animate-slide-down',
    slideUp: 'animate-slide-up',
    fadeIn: 'animate-fade-in',
    countdownUrgent: 'animate-countdown-urgent',
    imageFade: 'animate-image-fade',
  },
};

// Generate auction card classes
export const getAuctionCardClasses = (variant = 'default', isInteractive = true) => {
  return cn(
    auctionStyles.card.base,
    isInteractive && auctionStyles.card.interactive,
    variant === 'featured' && auctionStyles.card.featured
  );
};

// Generate countdown classes
export const getCountdownClasses = (status, isUrgent = false) => {
  const statusConfig = {
    upcoming: 'bg-blue-50 border-blue-200',
    live: isUrgent ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200',
    ended: 'bg-gray-50 border-gray-200',
  };
  
  return cn(
    auctionStyles.countdown.container,
    statusConfig[status.toLowerCase()] || statusConfig.ended
  );
};

// Common component combinations
export const commonStyles = {
  // Page headers
  pageHeader: 'text-4xl font-bold text-white mb-8',
  sectionHeader: 'text-2xl font-semibold text-neutral-900 mb-6',
  
  // Loading states
  loadingSpinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600',
  loadingText: 'text-lg text-neutral-600 animate-pulse',
  
  // Error states
  errorText: 'text-error-600 text-sm mt-1',
  errorBorder: 'border-error-500 focus:ring-error-500',
  
  // Success states
  successText: 'text-success-600 text-sm mt-1',
  successBorder: 'border-success-500 focus:ring-success-500',
  
  // Links
  link: 'text-primary-600 hover:text-primary-700 hover:underline transition-colors duration-300',
  linkButton: 'text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300',
};

export default {
  button: buttonStyles,
  card: cardStyles,
  input: inputStyles,
  badge: badgeStyles,
  layout: layoutStyles,
  animation: animationStyles,
  gradient: gradientStyles,
  auction: auctionStyles,
  common: commonStyles,
  utils: { 
    cn, 
    getButtonClasses, 
    getCardClasses, 
    getInputClasses, 
    getBadgeClasses, 
    getAuctionStatusClasses,
    getAuctionCardClasses,
    getCountdownClasses
  },
};
