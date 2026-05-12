import { type HTMLAttributes } from 'react';
import clsx from 'clsx';

export type CardVariant = 'default' | 'info' | 'beige';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export function Card({
  variant = 'default',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-[var(--radius-md)] shadow-[var(--shadow-card)]',
        variant === 'default' && 'bg-white',
        variant === 'info' && 'bg-primary/5',
        variant === 'beige' && 'bg-[var(--color-surface-beige)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
