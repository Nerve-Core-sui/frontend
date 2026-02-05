'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AttackEffectProps {
  isActive: boolean;
  damageAmount?: number;
}

export const AttackEffect: React.FC<AttackEffectProps> = ({ isActive, damageAmount = 0 }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Slash effect */}
          <motion.div
            className="absolute w-64 h-2 bg-gradient-to-r from-transparent via-white to-transparent"
            initial={{ x: -300, opacity: 0, rotate: -45 }}
            animate={{ x: 300, opacity: [0, 1, 0], rotate: -45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              boxShadow: '0 0 20px rgba(255,255,255,0.8)',
            }}
          />

          {/* Impact flash */}
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-white"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Slash trail particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gold-400"
              initial={{
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: Math.cos((i / 8) * Math.PI * 2) * 100,
                y: Math.sin((i / 8) * Math.PI * 2) * 100,
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            />
          ))}

          {/* Damage number */}
          {damageAmount > 0 && (
            <motion.div
              className="absolute text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-600"
              style={{
                textShadow: '0 0 20px rgba(239,68,68,1), 0 0 40px rgba(239,68,68,0.6)',
                WebkitTextStroke: '2px rgba(239,68,68,0.5)',
              }}
              initial={{ scale: 0.5, opacity: 0, y: 0 }}
              animate={{ scale: 1.5, opacity: [0, 1, 1, 0], y: -80 }}
              transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
            >
              -{damageAmount}
            </motion.div>
          )}

          {/* Critical hit stars */}
          {damageAmount > 25 && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute text-4xl"
                  initial={{
                    x: 0,
                    y: -20,
                    opacity: 0,
                    rotate: 0,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 200,
                    y: -100 - Math.random() * 50,
                    opacity: [0, 1, 0],
                    rotate: 360,
                  }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                >
                  ✨
                </motion.div>
              ))}
            </>
          )}

          {/* Shockwave rings */}
          <motion.div
            className="absolute w-40 h-40 rounded-full border-4 border-gold-500"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
          <motion.div
            className="absolute w-40 h-40 rounded-full border-4 border-gold-400"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          />
        </div>
      )}
    </AnimatePresence>
  );
};
