'use client';

import * as React from 'react';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-border bg-transparent text-foreground hover:bg-muted',
  ghost: 'bg-transparent text-foreground hover:bg-muted',
  destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  default: 'px-[1.125rem] py-2.5 text-[0.9375rem]',
  lg: 'px-6 py-3 text-base',
  icon: 'h-10 w-10 p-0',
};

function joinClasses(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'default', size = 'default', className, type = 'button', ...props },
  ref,
) {
  const safeVariant: ButtonVariant = VARIANT_CLASSES[variant] ? variant : 'default';
  const safeSize: ButtonSize = SIZE_CLASSES[size] ? size : 'default';

  return (
    <button
      ref={ref}
      type={type}
      className={joinClasses(
        BASE_CLASSES,
        VARIANT_CLASSES[safeVariant],
        SIZE_CLASSES[safeSize],
        className,
      )}
      {...props}
     data-nexen-id="nx-ca8cd720-0"/>
  );
});

Button.displayName = 'Button';

export default Button;