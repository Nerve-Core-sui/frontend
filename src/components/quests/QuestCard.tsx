'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Quest } from '@/lib/quests';

export interface QuestCardProps {
  quest: Quest;
  onClick: () => void;
  delay?: number;
}

const difficultyColors = {
  beginner: 'bg-success/10 text-success',
  intermediate: 'bg-warning/10 text-warning',
  advanced: 'bg-error/10 text-error',
};

const riskLabels = {
  low: { label: 'Low Risk', color: 'text-success' },
  medium: { label: 'Medium Risk', color: 'text-warning' },
  high: { label: 'High Risk', color: 'text-error' },
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onClick, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-surface rounded-2xl border border-border p-4 cursor-pointer
                 transition-all duration-200 hover:border-border-subtle hover:shadow-card-hover
                 active:scale-[0.98]"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-surface-elevated rounded-xl flex items-center justify-center text-2xl">
          {quest.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-base font-semibold text-text-primary mb-1 truncate">
            {quest.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-text-secondary line-clamp-2 mb-3">
            {quest.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Difficulty badge */}
            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${difficultyColors[quest.difficulty]}`}>
              {quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}
            </span>

            {/* Risk indicator */}
            <span className={`text-xs ${riskLabels[quest.risk].color}`}>
              {riskLabels[quest.risk].label}
            </span>

            {/* Steps count */}
            <span className="text-xs text-text-muted">
              {quest.steps.length} steps
            </span>
          </div>
        </div>

        {/* Chevron */}
        <div className="flex-shrink-0 self-center">
          <ChevronRight size={20} className="text-text-muted" />
        </div>
      </div>

      {/* Reward bar */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">Estimated Reward</span>
          <span className="text-sm font-semibold text-accent">
            {quest.estimatedReward}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
