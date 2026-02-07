'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface TopBarProps {
  title?: string;
  showLogo?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ title, showLogo = true }) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-surface border-b-2 border-border safe-top">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Logo or Title */}
        <div className="flex items-center gap-2">
          {showLogo ? (
            <motion.h1
              className="font-pixel text-sm text-pixel-gold uppercase tracking-wider"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
              }}
            >
              NERVE
            </motion.h1>
          ) : title ? (
            <h1 className="font-pixel text-sm text-text-primary uppercase">{title}</h1>
          ) : null}
        </div>

        {/* User Balance or Status */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 bg-surface-elevated border-2 border-border"
              style={{ borderRadius: '4px' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-2 h-2 bg-pixel-green animate-pulse-soft" style={{ borderRadius: 0 }} />
              <span className="font-sans text-lg text-text-primary">
                {user.balance.toLocaleString()} SUI
              </span>
            </motion.div>
          ) : (
            <div className="w-2 h-2 bg-text-muted" style={{ borderRadius: 0 }} />
          )}
        </div>
      </div>
    </header>
  );
};
