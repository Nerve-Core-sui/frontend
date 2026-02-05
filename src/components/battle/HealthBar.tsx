'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface HealthBarProps {
  current: number;
  max: number;
  label: string;
  showDamage?: boolean;
  damageAmount?: number;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  current,
  max,
  label,
  showDamage = false,
  damageAmount = 0,
}) => {
  const percentage = (current / max) * 100;

  return (
    <div className="relative w-full">
      {/* Label */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-fantasy text-gold-500 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-sm font-semibold text-white">
          {Math.round(current)} / {max}
        </span>
      </div>

      {/* Health bar container */}
      <motion.div
        className="relative h-6 rounded-lg overflow-hidden bg-dark-900 border-2 border-gold-500/30"
        animate={showDamage ? { x: [-2, 2, -2, 2, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {/* Inner shadow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10" />

        {/* Health fill with gradient */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 rounded-lg"
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background:
              percentage > 50
                ? 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)'
                : percentage > 25
                ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
            boxShadow: '0 0 20px currentColor, inset 0 1px 2px rgba(255,255,255,0.3)',
          }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* Decorative borders */}
        <div className="absolute inset-0 border-2 border-white/10 rounded-lg pointer-events-none z-20" />
      </motion.div>

      {/* Floating damage numbers */}
      <AnimatePresence>
        {showDamage && damageAmount > 0 && (
          <motion.div
            key={Date.now()}
            className="absolute right-0 top-0 pointer-events-none"
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -40, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <span className="text-2xl font-bold text-fantasy-red drop-shadow-[0_0_8px_rgba(239,68,68,1)]">
              -{damageAmount}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
