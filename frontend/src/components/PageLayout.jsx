import { cn } from '../styles/components.js';

const PageLayout = ({ 
  children, 
  className = '',
  variant = 'default',
  maxWidth = 'xl',
  padding = 'lg',
  background = 'neutral'
}) => {
  
  const variants = {
    default: 'min-h-screen',
    full: 'min-h-screen',
    compact: 'min-h-[80vh]',
    centered: 'min-h-screen flex items-center justify-center',
  };

  const maxWidths = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none',
  };

  const paddings = {
    none: '',
    sm: 'px-4 py-6',
    md: 'px-6 py-8',
    lg: 'px-6 py-10',
    xl: 'px-8 py-12',
  };

  const backgrounds = {
    neutral: 'bg-neutral-50',
    white: 'bg-white',
    primary: 'bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800',
    secondary: 'bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-700',
    transparent: 'bg-transparent',
  };

  return (
    <div className={cn(
      variants[variant],
      backgrounds[background],
      className
    )}>
      <div className={cn(
        'mx-auto',
        maxWidths[maxWidth],
        paddings[padding]
      )}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
