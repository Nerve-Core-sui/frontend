'use client';

import { useBattleContext } from '@/contexts/BattleContext';

export const useBattle = () => {
  const context = useBattleContext();

  return {
    startBattle: context.startBattle,
    updateStep: context.updateStep,
    setVictory: context.setVictory,
    setDefeat: context.setDefeat,
    endBattle: context.endBattle,
    isActive: context.isActive,
    state: context.state,
  };
};
