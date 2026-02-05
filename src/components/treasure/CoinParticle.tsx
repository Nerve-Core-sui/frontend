'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CoinParticleProps {
  delay: number;
  x: number;
  y: number;
  type?: 'gold' | 'purple';
}

export const CoinParticle: React.FC<CoinParticleProps> = ({
  delay,
  x,
  y,
  type = 'gold'
}) => {
  const colors = type === 'gold'
    ? {
        from: '#ffd700',
        to: '#e6c200',
        glow: 'rgba(255, 215, 0, 0.6)'
      }
    : {
        from: '#8b5cf6',
        to: '#7c3aed',
        glow: 'rgba(139, 92, 246, 0.6)'
      };

  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{
        x: 150,
        y: 150,
        scale: 0,
        opacity: 0,
        rotate: 0
      }}
      animate={{
        x: [150, x, x + (Math.random() - 0.5) * 50],
        y: [150, y - 100, y],
        scale: [0, 1.2, 1],
        opacity: [0, 1, 0],
        rotate: [0, 360 + Math.random() * 360],
      }}
      transition={{
        duration: 1.5,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40">
        <defs>
          <linearGradient id={`coin-gradient-${type}-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
          <filter id={`coin-glow-${type}-${delay}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Coin body */}
        <circle
          cx="20"
          cy="20"
          r="15"
          fill={`url(#coin-gradient-${type}-${delay})`}
          stroke={colors.from}
          strokeWidth="2"
          filter={`url(#coin-glow-${type}-${delay})`}
        />

        {/* Inner circle detail */}
        <circle
          cx="20"
          cy="20"
          r="12"
          fill="none"
          stroke={colors.from}
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Shine effect */}
        <ellipse
          cx="16"
          cy="14"
          rx="6"
          ry="8"
          fill="white"
          opacity="0.3"
        />

        {/* Symbol */}
        <text
          x="20"
          y="26"
          fontSize="18"
          fontWeight="bold"
          textAnchor="middle"
          fill={type === 'gold' ? '#4a2a0a' : '#3a1a5a'}
        >
          {type === 'gold' ? '$' : '₮'}
        </text>
      </svg>
    </motion.div>
  );
};

interface CoinBurstProps {
  count?: number;
  isActive: boolean;
}

export const CoinBurst: React.FC<CoinBurstProps> = ({
  count = 15,
  isActive
}) => {
  if (!isActive) return null;

  const coins = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const distance = 80 + Math.random() * 60;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const type = i % 3 === 0 ? 'purple' : 'gold'; // Mix of gold and purple coins

    return {
      id: i,
      x,
      y,
      delay: i * 0.05,
      type: type as 'gold' | 'purple',
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {coins.map(coin => (
        <CoinParticle
          key={coin.id}
          delay={coin.delay}
          x={coin.x}
          y={coin.y}
          type={coin.type}
        />
      ))}
    </div>
  );
};
