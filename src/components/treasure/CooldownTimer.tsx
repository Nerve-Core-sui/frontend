'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';

interface CooldownTimerProps {
  cooldownEndTime: number | null; // Unix timestamp in milliseconds
  onCooldownEnd?: () => void;
}

export const CooldownTimer: React.FC<CooldownTimerProps> = ({
  cooldownEndTime,
  onCooldownEnd,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isOnCooldown, setIsOnCooldown] = useState<boolean>(false);

  useEffect(() => {
    if (!cooldownEndTime) {
      setIsOnCooldown(false);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = cooldownEndTime - now;

      if (remaining <= 0) {
        setTimeRemaining(0);
        setIsOnCooldown(false);
        onCooldownEnd?.();
      } else {
        setTimeRemaining(remaining);
        setIsOnCooldown(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [cooldownEndTime, onCooldownEnd]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage (assuming 24h cooldown)
  const cooldownDuration = 24 * 60 * 60 * 1000; // 24 hours in ms
  const progress = cooldownEndTime
    ? Math.max(0, Math.min(100, ((cooldownDuration - timeRemaining) / cooldownDuration) * 100))
    : 100;

  if (!isOnCooldown) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-900/30 to-green-800/20 rounded-lg border border-green-500/50"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <Zap className="text-green-400" size={28} />
        </motion.div>
        <div>
          <p className="font-semibold text-green-400">Ready to Claim!</p>
          <p className="text-sm text-gray-400">The chest is fully charged</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-dark-800 border-2 border-purple-500/30 rounded-xl p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="text-purple-400" size={24} />
            <h3 className="text-lg font-semibold text-purple-400">Recharging</h3>
          </div>
          <span className="text-2xl font-bold font-fantasy text-gold-500">
            {formatTime(timeRemaining)}
          </span>
        </div>

        {/* Circular progress */}
        <div className="relative w-full h-32 flex items-center justify-center mb-4">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-dark-700"
            />

            {/* Progress circle */}
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#progress-gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{
                pathLength: progress / 100,
                strokeDasharray: '1 1',
              }}
            />

            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ffd700" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-bold text-transparent bg-clip-text bg-fantasy-gradient"
              key={Math.floor(progress)}
            >
              {Math.floor(progress)}%
            </motion.span>
            <span className="text-xs text-gray-500 mt-1">Charged</span>
          </div>
        </div>

        {/* Status message */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            The magical chest is gathering energy...
          </p>
          <p className="text-purple-400 text-xs mt-1">
            Next claim available in <span className="font-semibold">{formatTime(timeRemaining)}</span>
          </p>
        </div>

        {/* Energy particles animation */}
        <div className="relative h-12 mt-4 overflow-hidden rounded-lg bg-dark-700/50">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-purple-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
