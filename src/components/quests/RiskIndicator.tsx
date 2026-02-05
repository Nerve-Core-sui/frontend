import React from 'react';
import { clsx } from 'clsx';
import { Shield, AlertTriangle, Skull } from 'lucide-react';
import { QuestRisk } from '@/lib/quests';

export interface RiskIndicatorProps {
  risk: QuestRisk;
  className?: string;
  showLabel?: boolean;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  risk,
  className,
  showLabel = true
}) => {
  const configs = {
    low: {
      label: 'Low Risk',
      Icon: Shield,
      bgColor: 'bg-emerald-950/60',
      borderColor: 'border-emerald-500/60',
      textColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
      glowColor: 'shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    },
    medium: {
      label: 'Medium Risk',
      Icon: AlertTriangle,
      bgColor: 'bg-amber-950/60',
      borderColor: 'border-amber-500/60',
      textColor: 'text-amber-400',
      iconBg: 'bg-amber-500/20',
      glowColor: 'shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    },
    high: {
      label: 'High Risk',
      Icon: Skull,
      bgColor: 'bg-red-950/60',
      borderColor: 'border-red-500/60',
      textColor: 'text-red-400',
      iconBg: 'bg-red-500/20',
      glowColor: 'shadow-[0_0_10px_rgba(239,68,68,0.2)]',
    },
  };

  const config = configs[risk];
  const Icon = config.Icon;

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
        'border backdrop-blur-sm',
        'transition-all duration-300',
        config.bgColor,
        config.borderColor,
        config.textColor,
        config.glowColor,
        className
      )}
    >
      <div className={clsx('p-1 rounded-full', config.iconBg)}>
        <Icon size={14} className="stroke-[2.5]" />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold uppercase tracking-wide">
          {config.label}
        </span>
      )}
    </div>
  );
};
