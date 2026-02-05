'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface CharacterProps {
  type: 'player' | 'monster';
  monsterType?: 'merchant' | 'golem' | 'dragon';
  isAttacking?: boolean;
  isVictorious?: boolean;
  isDefeated?: boolean;
}

export const Character: React.FC<CharacterProps> = ({
  type,
  monsterType = 'merchant',
  isAttacking = false,
  isVictorious = false,
  isDefeated = false,
}) => {
  const getCharacterStyle = () => {
    if (type === 'player') {
      return {
        gradient: 'from-purple-500 to-purple-700',
        glow: 'drop-shadow-[0_0_30px_rgba(139,92,246,0.8)]',
      };
    }

    switch (monsterType) {
      case 'merchant':
        return {
          gradient: 'from-amber-500 to-orange-600',
          glow: 'drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]',
        };
      case 'golem':
        return {
          gradient: 'from-gray-500 to-gray-700',
          glow: 'drop-shadow-[0_0_30px_rgba(107,114,128,0.8)]',
        };
      case 'dragon':
        return {
          gradient: 'from-red-500 to-red-800',
          glow: 'drop-shadow-[0_0_40px_rgba(239,68,68,1)]',
        };
    }
  };

  const style = getCharacterStyle();

  const getCharacterShape = () => {
    if (type === 'player') {
      // Heroic warrior silhouette
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* Head */}
          <circle cx="50" cy="20" r="12" className="fill-current" />
          {/* Body */}
          <rect x="42" y="32" width="16" height="35" rx="3" className="fill-current" />
          {/* Sword arm (right) */}
          <rect
            x="58"
            y="35"
            width="8"
            height="30"
            rx="4"
            className="fill-current"
            transform="rotate(25 58 35)"
          />
          {/* Sword */}
          <rect
            x="75"
            y="15"
            width="4"
            height="40"
            className="fill-gold-500"
            transform="rotate(45 75 15)"
          />
          {/* Shield arm (left) */}
          <rect
            x="34"
            y="35"
            width="8"
            height="25"
            rx="4"
            className="fill-current"
            transform="rotate(-30 34 35)"
          />
          {/* Shield */}
          <circle cx="22" cy="50" r="10" className="fill-gold-400" opacity="0.8" />
          {/* Legs */}
          <rect
            x="44"
            y="67"
            width="6"
            height="30"
            rx="3"
            className="fill-current"
            transform="rotate(5 44 67)"
          />
          <rect
            x="50"
            y="67"
            width="6"
            height="30"
            rx="3"
            className="fill-current"
            transform="rotate(-5 50 67)"
          />
          {/* Cape */}
          <path
            d="M 35 35 Q 30 55 35 75 L 40 35 Z M 65 35 Q 70 55 65 75 L 60 35 Z"
            className="fill-current"
            opacity="0.6"
          />
        </svg>
      );
    }

    // Monster silhouettes
    switch (monsterType) {
      case 'merchant':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full">
            {/* Merchant NPC - rotund friendly shape */}
            <circle cx="50" cy="25" r="15" className="fill-current" /> {/* Head */}
            <ellipse cx="50" cy="65" rx="25" ry="30" className="fill-current" /> {/* Body */}
            <circle cx="42" cy="60" r="4" className="fill-gold-500" /> {/* Coin */}
            <circle cx="58" cy="60" r="4" className="fill-gold-500" /> {/* Coin */}
            <rect x="30" y="50" width="8" height="25" rx="4" className="fill-current" /> {/* Arm */}
            <rect x="62" y="50" width="8" height="25" rx="4" className="fill-current" /> {/* Arm */}
          </svg>
        );
      case 'golem':
        return (
          <svg viewBox="0 0 100 140" className="w-full h-full">
            {/* Stone golem - massive blocky shape */}
            <rect x="35" y="15" width="30" height="25" rx="3" className="fill-current" /> {/* Head */}
            <rect x="25" y="45" width="50" height="50" rx="5" className="fill-current" /> {/* Body */}
            <rect x="15" y="50" width="15" height="40" rx="3" className="fill-current" /> {/* Left arm */}
            <rect x="70" y="50" width="15" height="40" rx="3" className="fill-current" /> {/* Right arm */}
            <rect x="32" y="95" width="15" height="35" rx="3" className="fill-current" /> {/* Left leg */}
            <rect x="53" y="95" width="15" height="35" rx="3" className="fill-current" /> {/* Right leg */}
            {/* Glowing cracks */}
            <path
              d="M 40 60 L 45 70 M 55 65 L 60 75 M 50 80 L 50 90"
              stroke="#f59e0b"
              strokeWidth="2"
              className="opacity-80"
            />
          </svg>
        );
      case 'dragon':
        return (
          <svg viewBox="0 0 140 120" className="w-full h-full">
            {/* Epic dragon - menacing profile */}
            <ellipse cx="70" cy="70" rx="40" ry="30" className="fill-current" /> {/* Body */}
            <circle cx="40" cy="50" r="20" className="fill-current" /> {/* Head */}
            <path
              d="M 20 45 L 15 40 L 18 43 L 12 38 L 16 41 L 10 35"
              stroke="currentColor"
              strokeWidth="3"
              className="fill-none"
            /> {/* Horns */}
            <circle cx="35" cy="48" r="3" className="fill-red-400" /> {/* Eye */}
            {/* Wings */}
            <path
              d="M 75 60 Q 100 30 120 50 Q 110 65 75 70 Z"
              className="fill-current"
              opacity="0.7"
            />
            <path
              d="M 75 75 Q 100 100 120 85 Q 110 75 75 80 Z"
              className="fill-current"
              opacity="0.7"
            />
            {/* Tail */}
            <path
              d="M 110 75 Q 130 80 135 70 L 130 73"
              stroke="currentColor"
              strokeWidth="6"
              className="fill-none"
            />
            {/* Fire breath effect */}
            <motion.path
              d="M 15 55 Q 5 50 0 55 Q 3 60 10 58"
              className="fill-orange-500"
              opacity="0.6"
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </svg>
        );
    }
  };

  return (
    <motion.div
      className={`relative ${type === 'player' ? 'w-32 h-40' : 'w-40 h-48'}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isDefeated ? 0.3 : 1,
        scale: isDefeated ? 0.8 : 1,
        y: isAttacking ? -15 : isDefeated ? 20 : 0,
        rotateZ: isDefeated ? (type === 'player' ? -20 : 20) : 0,
      }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Character silhouette with gradient */}
      <motion.div
        className={`relative w-full h-full bg-gradient-to-b ${style.gradient} rounded-lg ${style.glow}`}
        animate={{
          // Idle breathing animation
          scale: isAttacking ? [1, 1.1, 1] : isVictorious ? 1.1 : [1, 1.02, 1],
        }}
        transition={{
          duration: isAttacking ? 0.6 : 2,
          repeat: isAttacking || isVictorious ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* SVG character */}
        <div className="absolute inset-0 flex items-center justify-center p-2 text-white/90">
          {getCharacterShape()}
        </div>

        {/* Victory glow pulse */}
        {isVictorious && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gold-500"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}

        {/* Defeated fade effect */}
        {isDefeated && (
          <motion.div
            className="absolute inset-0 bg-black/60 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.div>

      {/* Attack flash effect */}
      {isAttacking && (
        <motion.div
          className="absolute inset-0 bg-white rounded-lg"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Shadow */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/40 rounded-full blur-md"
        animate={{
          scale: isAttacking ? 0.8 : 1,
          opacity: isDefeated ? 0.2 : 0.4,
        }}
      />
    </motion.div>
  );
};
