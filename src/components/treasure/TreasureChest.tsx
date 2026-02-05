'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type ChestState = 'closed' | 'opening' | 'open' | 'coins_flying' | 'complete';

interface TreasureChestProps {
  onClaim: () => Promise<void>;
  isOnCooldown: boolean;
  disabled?: boolean;
}

export const TreasureChest: React.FC<TreasureChestProps> = ({
  onClaim,
  isOnCooldown,
  disabled = false,
}) => {
  const [chestState, setChestState] = useState<ChestState>('closed');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || isOnCooldown || chestState !== 'closed' || isLoading) return;

    setIsLoading(true);
    setChestState('opening');

    try {
      await onClaim();

      // Animation sequence
      setTimeout(() => setChestState('open'), 800);
      setTimeout(() => setChestState('coins_flying'), 1200);
      setTimeout(() => setChestState('complete'), 2500);
      setTimeout(() => setChestState('closed'), 4500);
    } catch (error) {
      console.error('Claim failed:', error);
      setChestState('closed');
    } finally {
      setIsLoading(false);
    }
  };

  const isInteractive = !disabled && !isOnCooldown && chestState === 'closed' && !isLoading;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[500px]">
      {/* Chest Container */}
      <motion.div
        className="relative cursor-pointer"
        whileHover={isInteractive ? { scale: 1.05, y: -10 } : {}}
        whileTap={isInteractive ? { scale: 0.95 } : {}}
        onClick={handleClick}
        animate={
          chestState === 'closed' && isInteractive
            ? {
                y: [0, -8, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
            : {}
        }
      >
        {/* Glow effect */}
        <AnimatePresence>
          {(chestState === 'open' || chestState === 'coins_flying') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 blur-3xl bg-gradient-radial from-gold-500/60 via-gold-500/30 to-transparent"
              style={{ zIndex: -1 }}
            />
          )}
        </AnimatePresence>

        {/* Chest SVG */}
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          {/* Bottom of chest (always visible) */}
          <g id="chest-bottom">
            {/* Main body - dark wood */}
            <rect
              x="50"
              y="160"
              width="200"
              height="120"
              rx="10"
              fill="url(#wood-gradient)"
              stroke="#5a3a1a"
              strokeWidth="3"
            />

            {/* Wood planks detail */}
            <line x1="50" y1="190" x2="250" y2="190" stroke="#4a2a0a" strokeWidth="2" opacity="0.4" />
            <line x1="50" y1="220" x2="250" y2="220" stroke="#4a2a0a" strokeWidth="2" opacity="0.4" />
            <line x1="50" y1="250" x2="250" y2="250" stroke="#4a2a0a" strokeWidth="2" opacity="0.4" />

            {/* Gold trim bottom */}
            <rect
              x="50"
              y="270"
              width="200"
              height="10"
              fill="url(#gold-gradient)"
              stroke="#b8860b"
              strokeWidth="2"
            />

            {/* Gold corner details */}
            <circle cx="70" cy="275" r="8" fill="url(#gold-shine)" stroke="#b8860b" strokeWidth="1.5" />
            <circle cx="230" cy="275" r="8" fill="url(#gold-shine)" stroke="#b8860b" strokeWidth="1.5" />

            {/* Lock plate */}
            <rect
              x="135"
              y="200"
              width="30"
              height="40"
              rx="5"
              fill="url(#gold-gradient)"
              stroke="#b8860b"
              strokeWidth="2"
            />
            <circle cx="150" cy="220" r="6" fill="#3a2a0a" stroke="#b8860b" strokeWidth="1" />
          </g>

          {/* Lid (animated) */}
          <motion.g
            id="chest-lid"
            style={{ originX: '150px', originY: '160px' }}
            animate={{
              rotateX: chestState === 'opening' || chestState === 'open' || chestState === 'coins_flying' ? -60 : 0,
              y: chestState === 'opening' || chestState === 'open' || chestState === 'coins_flying' ? -20 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
            }}
          >
            {/* Lid top - rounded */}
            <path
              d="M 50 160 Q 50 100, 150 90 T 250 160 L 250 160 L 50 160 Z"
              fill="url(#wood-gradient-dark)"
              stroke="#5a3a1a"
              strokeWidth="3"
            />

            {/* Lid wood details */}
            <path
              d="M 60 150 Q 60 110, 150 100 T 240 150"
              stroke="#4a2a0a"
              strokeWidth="2"
              opacity="0.4"
              fill="none"
            />

            {/* Gold trim on lid */}
            <path
              d="M 50 160 L 55 155 L 245 155 L 250 160 Z"
              fill="url(#gold-gradient)"
              stroke="#b8860b"
              strokeWidth="2"
            />

            {/* Gold decorative bands */}
            <rect
              x="48"
              y="120"
              width="6"
              height="40"
              rx="2"
              fill="url(#gold-gradient)"
              stroke="#b8860b"
              strokeWidth="1"
            />
            <rect
              x="246"
              y="120"
              width="6"
              height="40"
              rx="2"
              fill="url(#gold-gradient)"
              stroke="#b8860b"
              strokeWidth="1"
            />
          </motion.g>

          {/* Light rays when open */}
          <AnimatePresence>
            {(chestState === 'open' || chestState === 'coins_flying') && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.8] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <path d="M 150 160 L 130 50 L 140 50 Z" fill="url(#light-ray)" opacity="0.6" />
                <path d="M 150 160 L 145 40 L 155 40 Z" fill="url(#light-ray)" opacity="0.8" />
                <path d="M 150 160 L 160 50 L 170 50 Z" fill="url(#light-ray)" opacity="0.6" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Gradients */}
          <defs>
            <linearGradient id="wood-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6b4423" />
              <stop offset="50%" stopColor="#5a3a1a" />
              <stop offset="100%" stopColor="#4a2a0a" />
            </linearGradient>

            <linearGradient id="wood-gradient-dark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5a3a1a" />
              <stop offset="100%" stopColor="#3a2a0a" />
            </linearGradient>

            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="50%" stopColor="#ffed4e" />
              <stop offset="100%" stopColor="#e6c200" />
            </linearGradient>

            <radialGradient id="gold-shine">
              <stop offset="0%" stopColor="#ffed4e" />
              <stop offset="100%" stopColor="#e6c200" />
            </radialGradient>

            <linearGradient id="light-ray" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="rgba(255, 215, 0, 0.4)" />
              <stop offset="100%" stopColor="rgba(255, 237, 78, 0.6)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
          </div>
        )}
      </motion.div>

      {/* Status text */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {isOnCooldown ? (
          <p className="text-gray-400 text-lg">
            Chest is recharging its magic...
          </p>
        ) : chestState === 'closed' ? (
          <p className="text-gold-500 text-xl font-fantasy text-glow-gold">
            Click to open the treasure chest
          </p>
        ) : chestState === 'complete' ? (
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-green-400 text-xl font-bold"
          >
            Tokens claimed successfully!
          </motion.p>
        ) : null}
      </motion.div>

      {/* Disabled overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <p className="text-gray-400 text-xl font-semibold">
            Please connect your wallet first
          </p>
        </div>
      )}
    </div>
  );
};
