import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  glow = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'relative overflow-hidden font-semibold rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'btn-fantasy',
    secondary: 'bg-dark-700 border-2 border-purple-500/50 text-purple-400 hover:bg-dark-600 hover:border-purple-400 hover:shadow-purple',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white border border-red-400/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]',
    ghost: 'bg-transparent border border-gray-600 text-gray-300 hover:bg-dark-700 hover:border-gold-500/50 hover:text-gold-500',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        glow && 'animate-glow',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
