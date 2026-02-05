'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, ArrowRight, Coins, Star } from 'lucide-react';

export interface VictoryScreenProps {
  questName: string;
  rewards?: {
    xp?: number;
    coins?: number;
    items?: string[];
  };
  onContinue: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  questName,
  rewards = {},
  onContinue,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#ffd700', '#ff69b4', '#00ff00', '#ff0000', '#00bfff'][
                    i % 5
                  ],
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 100,
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 720,
                  x: (Math.random() - 0.5) * 200,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'linear',
                }}
                exit={{ opacity: 0 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Victory card */}
      <motion.div
        className="relative z-10 max-w-2xl w-full mx-4"
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 border-2 border-gold-500 shadow-[0_0_60px_rgba(255,215,0,0.4)]">
          {/* Decorative corner ornaments */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-gold-500 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-gold-500 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-gold-500 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-gold-500 rounded-br-2xl" />

          {/* Trophy icon with glow */}
          <motion.div
            className="flex justify-center mb-6"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full blur-2xl bg-gold-500/50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Trophy className="relative w-24 h-24 text-gold-500 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]" />
            </div>
          </motion.div>

          {/* Victory text */}
          <motion.h2
            className="text-5xl font-fantasy text-transparent bg-clip-text bg-gradient-to-b from-gold-400 to-gold-600 text-center mb-2"
            style={{
              textShadow: '0 0 30px rgba(255,215,0,0.5)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            VICTORY!
          </motion.h2>

          <motion.p
            className="text-xl text-gray-300 text-center mb-8 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {questName} Completed
          </motion.p>

          {/* Rewards section */}
          {(rewards.xp || rewards.coins || rewards.items) && (
            <motion.div
              className="space-y-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-gold-500" />
                <h3 className="text-lg font-semibold text-gold-400 uppercase tracking-wider">
                  Rewards Earned
                </h3>
                <Sparkles className="w-5 h-5 text-gold-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {rewards.xp && (
                  <motion.div
                    className="p-4 rounded-lg bg-purple-500/20 border border-purple-500/30"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3">
                      <Star className="w-8 h-8 text-purple-400" />
                      <div>
                        <p className="text-2xl font-bold text-purple-400">+{rewards.xp}</p>
                        <p className="text-sm text-gray-400 uppercase">Experience</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {rewards.coins && (
                  <motion.div
                    className="p-4 rounded-lg bg-gold-500/20 border border-gold-500/30"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3">
                      <Coins className="w-8 h-8 text-gold-400" />
                      <div>
                        <p className="text-2xl font-bold text-gold-400">+{rewards.coins}</p>
                        <p className="text-sm text-gray-400 uppercase">Gold</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {rewards.items && rewards.items.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-dark-800 border border-gray-700">
                  <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Items</p>
                  <div className="flex flex-wrap gap-2">
                    {rewards.items.map((item, index) => (
                      <motion.span
                        key={index}
                        className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-gold-500/20 border border-gold-500/30 text-sm text-gray-300"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Continue button */}
          <motion.button
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-3 shadow-gold-lg transition-all duration-300 hover:shadow-gold-lg hover:scale-[1.02] active:scale-[0.98]"
            onClick={onContinue}
            whileHover={{ boxShadow: '0 0 40px rgba(255,215,0,0.8)' }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            Continue
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>

      {/* Animated stars background */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </motion.div>
  );
};
