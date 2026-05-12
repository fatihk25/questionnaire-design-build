import { forwardRef } from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary/50',
  secondary:
    'bg-white text-primary border border-primary hover:bg-primary/5 focus-visible:ring-primary/50',
  ghost: 'bg-transparent text-primary hover:bg-primary/5 focus-visible:ring-primary/50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(
          // Base styles
          'inline-flex items-center justify-center font-medium',
          'rounded-[var(--radius-sm)]',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          // Mobile touch target: minimum 44×44px
          'min-h-11 min-w-11',
          // Variant
          variantStyles[variant],
          // Size
          sizeStyles[size],
          // Disabled
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          // Custom classes
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
