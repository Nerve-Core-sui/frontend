'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { InventoryItem as InventoryItemType, ItemRarity } from '@/types/inventory';
import { clsx } from 'clsx';

interface InventoryItemProps {
  item: InventoryItemType;
  onClick: () => void;
}

// Rarity styling configuration
const rarityConfig: Record<ItemRarity, {
  border: string;
  glow: string;
  bg: string;
  text: string;
  badge: string;
}> = {
  common: {
    border: 'border-gray-600',
    glow: 'hover:shadow-[0_0_15px_rgba(156,163,175,0.3)]',
    bg: 'from-gray-800/50 to-gray-900/50',
    text: 'text-gray-400',
    badge: 'bg-gray-700 text-gray-300',
  },
  rare: {
    border: 'border-blue-500/60',
    glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]',
    bg: 'from-blue-900/30 to-gray-900/50',
    text: 'text-blue-400',
    badge: 'bg-blue-700 text-blue-200',
  },
  epic: {
    border: 'border-purple-500/60',
    glow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]',
    bg: 'from-purple-900/30 to-gray-900/50',
    text: 'text-purple-400',
    badge: 'bg-purple-700 text-purple-200',
  },
  legendary: {
    border: 'border-gold-500',
    glow: 'hover:shadow-[0_0_30px_rgba(255,215,0,0.7)] animate-glow',
    bg: 'from-gold-900/30 to-gray-900/50',
    text: 'text-gold-400',
    badge: 'bg-gradient-to-r from-gold-600 to-gold-500 text-dark-900 font-bold',
  },
};

export const InventoryItem: React.FC<InventoryItemProps> = ({ item, onClick }) => {
  const config = rarityConfig[item.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={clsx(
        'relative cursor-pointer rounded-lg overflow-hidden',
        'border-2 transition-all duration-300',
        'bg-gradient-to-br',
        config.border,
        config.glow,
        config.bg,
        'group'
      )}
    >
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-500/30 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-500/30 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-500/30 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-500/30 rounded-br-lg" />

      {/* Shimmer effect for legendary items */}
      {item.rarity === 'legendary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/10 to-transparent animate-shimmer" />
      )}

      <div className="relative p-6 space-y-4">
        {/* Rarity badge */}
        <div className="flex items-center justify-between">
          <span className={clsx('px-3 py-1 text-xs rounded-full uppercase tracking-wider', config.badge)}>
            {item.rarity}
          </span>
          {item.rarity === 'legendary' && (
            <Sparkles className="w-5 h-5 text-gold-500 animate-pulse" />
          )}
        </div>

        {/* Item icon */}
        <div className="flex items-center justify-center">
          <div
            className={clsx(
              'w-20 h-20 rounded-full flex items-center justify-center',
              'bg-gradient-to-br shadow-lg',
              item.type === 'token'
                ? item.icon === 'gold'
                  ? 'from-gold-500 to-gold-600'
                  : 'from-gray-400 to-gray-500'
                : 'from-purple-500 to-purple-600',
              'group-hover:scale-110 transition-transform duration-300'
            )}
          >
            {item.type === 'token' ? (
              <Coins className="w-10 h-10 text-dark-900" />
            ) : (
              <Shield className="w-10 h-10 text-white" />
            )}
          </div>
        </div>

        {/* Item name */}
        <div className="text-center">
          <h3 className={clsx('text-lg font-fantasy tracking-wide', config.text)}>
            {item.type === 'token' ? item.symbol : item.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {item.type === 'token' ? item.name : 'Equipment'}
          </p>
        </div>

        {/* Item stats */}
        <div className="space-y-2 pt-2 border-t border-gray-700/50">
          {item.type === 'token' ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Balance</span>
                <span className={clsx('font-semibold', config.text)}>
                  {item.balanceFormatted}
                </span>
              </div>
              {item.usdValue !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Value</span>
                  <span className="text-green-400 font-semibold">
                    ${item.usdValue.toFixed(2)}
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Deposited</span>
                <span className={clsx('font-semibold', config.text)}>
                  {item.depositAmountFormatted}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Yield
                </span>
                <span className="text-green-400 font-semibold">
                  +{item.earnedYieldFormatted}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Health</span>
                <span
                  className={clsx(
                    'font-semibold',
                    item.healthFactor > 200 ? 'text-green-400' :
                    item.healthFactor > 120 ? 'text-yellow-400' : 'text-red-400'
                  )}
                >
                  {item.healthFactor.toFixed(0)}%
                </span>
              </div>
            </>
          )}
        </div>

        {/* Hover indicator */}
        <div className="pt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-gold-500">Click to view details</span>
        </div>
      </div>
    </motion.div>
  );
};
