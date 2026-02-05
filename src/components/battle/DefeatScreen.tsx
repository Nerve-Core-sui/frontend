'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Skull, RotateCcw, AlertTriangle } from 'lucide-react';

export interface DefeatScreenProps {
  errorMessage?: string;
  questName: string;
  onRetry: () => void;
  onCancel: () => void;
}

export const DefeatScreen: React.FC<DefeatScreenProps> = ({
  errorMessage,
  questName,
  onRetry,
  onCancel,
}) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dark backdrop */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-red-900/30 to-black/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Defeat card */}
      <motion.div
        className="relative z-10 max-w-2xl w-full mx-4"
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 border-2 border-red-500/50 shadow-[0_0_60px_rgba(239,68,68,0.3)]">
          {/* Decorative corner ornaments */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-red-500/50 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-red-500/50 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-red-500/50 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-red-500/50 rounded-br-2xl" />

          {/* Skull icon */}
          <motion.div
            className="flex justify-center mb-6"
            animate={{
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full blur-2xl bg-red-500/40"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Skull className="relative w-24 h-24 text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
            </div>
          </motion.div>

          {/* Defeat text */}
          <motion.h2
            className="text-5xl font-fantasy text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-600 text-center mb-2"
            style={{
              textShadow: '0 0 30px rgba(239,68,68,0.5)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            DEFEAT
          </motion.h2>

          <motion.p
            className="text-xl text-gray-300 text-center mb-8 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {questName} Failed
          </motion.p>

          {/* Error message */}
          {errorMessage && (
            <motion.div
              className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-1">
                    Error Details
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed break-words">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            {/* Retry button */}
            <motion.button
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] active:scale-[0.98]"
              onClick={onRetry}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-6 h-6" />
              Try Again
            </motion.button>

            {/* Cancel button */}
            <motion.button
              className="w-full py-3 px-6 rounded-xl bg-gray-700/50 text-gray-300 font-semibold text-base uppercase tracking-wider border border-gray-600 transition-all duration-300 hover:bg-gray-700/70 active:scale-[0.98]"
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </motion.div>

          {/* Motivational quote */}
          <motion.p
            className="mt-6 text-center text-sm text-gray-500 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            "Every hero faces defeat. It's rising again that defines greatness."
          </motion.p>
        </div>
      </motion.div>

      {/* Animated embers falling */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`ember-${i}`}
          className="absolute w-1 h-2 bg-red-500 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-5%',
          }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear',
          }}
        />
      ))}
    </motion.div>
  );
};
