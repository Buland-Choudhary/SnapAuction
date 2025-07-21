import { cn } from '../styles/components.js';

const Container = ({ 
  children, 
  size = 'lg',
  padding = 'default',
  className = '' 
}) => {
  
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none',
  };

  const paddings = {
    none: '',
    sm: 'px-4',
    default: 'px-6',
    lg: 'px-8',
  };

  return (
    <div className={cn(
      'mx-auto',
      sizes[size],
      paddings[padding],
      className
    )}>
      {children}
    </div>
  );
};

export default Container;
