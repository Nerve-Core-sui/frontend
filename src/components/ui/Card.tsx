import React from 'react';
import { clsx } from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = true,
  glow = false
}) => {
  return (
    <div
      className={clsx(
        'card-fantasy p-6',
        hoverable && 'cursor-pointer',
        glow && 'shadow-gold-lg',
        className
      )}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={clsx('mb-4 pb-4 border-b border-gold-500/20', className)}>
      {children}
    </div>
  );
};

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className, glow = false }) => {
  return (
    <h3 className={clsx(
      'text-2xl font-fantasy text-gold-500',
      glow && 'text-glow-gold',
      className
    )}>
      {children}
    </h3>
  );
};

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={clsx('text-gray-300', className)}>
      {children}
    </div>
  );
};

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={clsx('mt-6 pt-4 border-t border-gold-500/20', className)}>
      {children}
    </div>
  );
};
