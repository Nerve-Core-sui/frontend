import React from 'react';
import { clsx } from 'clsx';
import { Star } from 'lucide-react';
import { QuestDifficulty } from '@/lib/quests';

export interface DifficultyBadgeProps {
  difficulty: QuestDifficulty;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, className }) => {
  const configs = {
    beginner: {
      label: 'Beginner',
      stars: 1,
      bgColor: 'bg-emerald-950/60',
      borderColor: 'border-emerald-500/60',
      textColor: 'text-emerald-400',
      glowColor: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    },
    intermediate: {
      label: 'Intermediate',
      stars: 2,
      bgColor: 'bg-amber-950/60',
      borderColor: 'border-amber-500/60',
      textColor: 'text-amber-400',
      glowColor: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    },
    advanced: {
      label: 'Advanced',
      stars: 3,
      bgColor: 'bg-red-950/60',
      borderColor: 'border-red-500/60',
      textColor: 'text-red-400',
      glowColor: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    },
  };

  const config = configs[difficulty];

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
        'border-2 backdrop-blur-sm',
        'transition-all duration-300',
        config.bgColor,
        config.borderColor,
        config.textColor,
        config.glowColor,
        className
      )}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: config.stars }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={clsx('fill-current', config.textColor)}
          />
        ))}
      </div>
      <span className="text-xs font-bold uppercase tracking-wider">
        {config.label}
      </span>
    </div>
  );
};
