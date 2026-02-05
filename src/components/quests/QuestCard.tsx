'use client';

import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Quest } from '@/lib/quests';
import { DifficultyBadge } from './DifficultyBadge';
import { RiskIndicator } from './RiskIndicator';

export interface QuestCardProps {
  quest: Quest;
  onClick: () => void;
  delay?: number;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onClick, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 }
      }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div
        className={clsx(
          'relative h-full',
          'bg-gradient-to-br from-dark-800 via-dark-800 to-dark-900',
          'border-2 border-gold-500/20 rounded-xl',
          'shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
          'transition-all duration-300',
          'overflow-hidden',
          'group-hover:border-gold-500/60',
          'group-hover:shadow-[0_8px_30px_rgba(255,215,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)]',
          'before:absolute before:inset-0',
          'before:bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]',
          'before:pointer-events-none'
        )}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-gold-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-gold-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />

        {/* Top decorative border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative p-6 flex flex-col h-full">
          {/* Quest Icon - Large and prominent */}
          <div className="flex justify-center mb-4">
            <motion.div
              className={clsx(
                'relative w-24 h-24 rounded-2xl',
                'bg-gradient-to-br from-dark-700 to-dark-900',
                'border-2 border-gold-500/30',
                'flex items-center justify-center',
                'shadow-[0_0_20px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)]',
                'group-hover:border-gold-500/60',
                'group-hover:shadow-[0_0_30px_rgba(255,215,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.2)]',
                'transition-all duration-300'
              )}
              whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
            >
              <span className="text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {quest.icon}
              </span>

              {/* Corner decorations */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-gold-500/50" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-gold-500/50" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-gold-500/50" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-gold-500/50" />
            </motion.div>
          </div>

          {/* Quest Title */}
          <h3 className={clsx(
            'text-2xl font-fantasy text-center mb-3',
            'bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 bg-clip-text text-transparent',
            'group-hover:from-gold-300 group-hover:via-gold-400 group-hover:to-gold-300',
            'transition-all duration-300',
            'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
          )}>
            {quest.title}
          </h3>

          {/* Badges Row */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <DifficultyBadge difficulty={quest.difficulty} />
            <RiskIndicator risk={quest.risk} showLabel={false} />
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm text-center leading-relaxed mb-4 flex-grow">
            {quest.description}
          </p>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent mb-4" />

          {/* Reward Section */}
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-dark-900/60 border border-gold-500/30 group-hover:border-gold-500/50 transition-colors duration-300">
            <Sparkles size={16} className="text-gold-500" />
            <span className="text-sm font-semibold text-gold-400">
              Reward: {quest.estimatedReward}
            </span>
          </div>

          {/* Steps Preview */}
          <div className="mt-4 pt-4 border-t border-gold-500/10">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
              <span className="font-semibold">{quest.steps.length} Steps</span>
              <span className="text-gold-500/50">•</span>
              <span className="capitalize">{quest.category}</span>
            </div>
          </div>

          {/* Hover indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-gold-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            style={{
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </motion.div>
  );
};
