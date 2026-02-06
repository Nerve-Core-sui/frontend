'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = clsx(
    'inline-flex items-center justify-center gap-2 font-pixel uppercase',
    'transition-all duration-100 border-2',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  const variants = {
    primary: clsx(
      'bg-pixel-green border-pixel-greenDark text-background',
      'hover:bg-pixel-greenDark shadow-pixel-green',
      'active:translate-x-1 active:translate-y-1 active:shadow-pixel-sm'
    ),
    secondary: clsx(
      'bg-pixel-gold border-pixel-goldDark text-background',
      'hover:bg-pixel-goldDark shadow-pixel-gold',
      'active:translate-x-1 active:translate-y-1 active:shadow-pixel-sm'
    ),
    ghost: clsx(
      'bg-transparent border-border text-text-secondary',
      'hover:bg-surface hover:text-text-primary'
    ),
    danger: clsx(
      'bg-error border-pixel-redDark text-background',
      'hover:bg-pixel-redDark shadow-pixel',
      'active:translate-x-1 active:translate-y-1 active:shadow-pixel-sm'
    ),
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-5 py-2.5 text-xs',
    lg: 'w-full px-6 py-3 text-xs',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      style={{ borderRadius: '4px' }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="animate-pulse">...</span>
      ) : icon ? (
        <span className="text-base">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
