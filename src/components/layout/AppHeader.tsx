'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export const AppHeader: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="phone-header">
      {/* Logo */}
      <motion.div
        className="flex items-center gap-2 relative z-10"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Image
          src="/logo.png"
          alt="Nerve"
          width={28}
          height={28}
          className="w-7 h-7"
          style={{ imageRendering: 'pixelated' }}
        />
        <h1
          className="font-pixel text-[13px] text-pixel-lime tracking-wider"
          style={{
            textShadow: '0 0 12px rgba(132, 204, 22, 0.4), 2px 2px 0 #0d0a14',
          }}
        >
          NERVE
        </h1>
      </motion.div>

      {/* Status indicator */}
      <motion.div
        className="flex items-center gap-2 relative z-10"
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 px-2.5 py-1 bg-surface-deep border-2 border-border">
            <div
              className="w-2 h-2 bg-pixel-lime"
              style={{
                boxShadow: '0 0 6px rgba(132, 204, 22, 0.8)',
              }}
            />
            <span className="font-sans text-sm text-text-secondary">
              {user.address.slice(0, 6)}...{user.address.slice(-4)}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2.5 py-1">
            <div className="w-2 h-2 bg-pixel-red" style={{ boxShadow: '0 0 4px rgba(239, 68, 68, 0.5)' }} />
            <span className="font-pixel text-[8px] text-text-muted uppercase">Offline</span>
          </div>
        )}
      </motion.div>
    </header>
  );
};
