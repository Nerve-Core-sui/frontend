'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

interface TokenRewardProps {
  msuiAmount: number;
  musdcAmount: number;
  isVisible: boolean;
}

const AnimatedNumber: React.FC<{
  value: number;
  duration?: number;
  prefix?: string;
}> = ({ value, duration = 1500, prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeOutExpo * value);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString()}
    </span>
  );
};

export const TokenReward: React.FC<TokenRewardProps> = ({
  msuiAmount,
  musdcAmount,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
    >
      <div className="bg-dark-800/95 backdrop-blur-xl border-2 border-gold-500 rounded-2xl p-8 shadow-gold-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center mb-6"
        >
          <h3 className="text-3xl font-fantasy text-gold-500 text-glow-gold mb-2">
            Treasure Claimed!
          </h3>
          <p className="text-gray-400">Your rewards have been added</p>
        </motion.div>

        <div className="space-y-4">
          {/* MSUI Reward */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gold-900/30 to-gold-800/20 rounded-lg border border-gold-500/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-gold">
                <Coins size={24} className="text-dark-900" />
              </div>
              <div>
                <p className="text-sm text-gray-400">MSUI Tokens</p>
                <p className="text-2xl font-bold text-gold-500">
                  <AnimatedNumber value={msuiAmount} prefix="+" />
                </p>
              </div>
            </div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                delay: 0.6,
                duration: 0.5,
                repeat: 2
              }}
            >
              <Coins size={32} className="text-gold-500" />
            </motion.div>
          </motion.div>

          {/* MUSDC Reward */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-lg border border-purple-500/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-purple">
                <Coins size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">MUSDC Tokens</p>
                <p className="text-2xl font-bold text-purple-400">
                  <AnimatedNumber value={musdcAmount} prefix="+" />
                </p>
              </div>
            </div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0]
              }}
              transition={{
                delay: 0.8,
                duration: 0.5,
                repeat: 2
              }}
            >
              <Coins size={32} className="text-purple-400" />
            </motion.div>
          </motion.div>
        </div>

        {/* Success message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-green-400 font-semibold flex items-center justify-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ✓
            </motion.span>
            Successfully added to your wallet
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
