'use client';

import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  interactive = false,
  onClick,
}) => {
  const Component = interactive ? motion.div : 'div';
  const motionProps = interactive
    ? {
        whileTap: { x: 2, y: 2 },
        transition: { duration: 0.1 },
      }
    : {};

  return (
    <Component
      className={clsx(
        'bg-surface border-2 border-border p-4',
        'transition-all duration-100 shadow-pixel',
        interactive && 'cursor-pointer hover:border-border-light',
        className
      )}
      style={{ borderRadius: '4px' }}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={clsx('mb-3', className)}>
      {children}
    </div>
  );
};

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3 className={clsx('font-pixel text-sm text-text-primary uppercase', className)}>
      {children}
    </h3>
  );
};

export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
  return (
    <p className={clsx('font-sans text-base text-text-secondary mt-2', className)}>
      {children}
    </p>
  );
};

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={clsx('text-text-secondary font-sans', className)}>
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
    <div className={clsx('mt-4 pt-4 border-t-2 border-border', className)}>
      {children}
    </div>
  );
};
