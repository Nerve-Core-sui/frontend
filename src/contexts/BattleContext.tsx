'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BattleState, BattleContextValue, BattleStep, MonsterType } from '@/types/battle';

const BattleContext = createContext<BattleContextValue | undefined>(undefined);

const initialState: BattleState = {
  isActive: false,
  status: 'idle',
  currentStep: 0,
  steps: [],
  monsterType: 'merchant',
  questName: '',
  monsterHealth: 100,
};

export const BattleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BattleState>(initialState);

  const startBattle = useCallback(
    (config: { steps: BattleStep[]; monsterType: MonsterType; questName: string }) => {
      setState({
        isActive: true,
        status: 'fighting',
        currentStep: 0,
        steps: config.steps,
        monsterType: config.monsterType,
        questName: config.questName,
        monsterHealth: 100,
      });
    },
    []
  );

  const updateStep = useCallback((stepIndex: number, status: BattleStep['status']) => {
    setState((prev) => {
      const newSteps = [...prev.steps];
      newSteps[stepIndex] = { ...newSteps[stepIndex], status };

      // Calculate health depletion based on step completion
      const completedSteps = newSteps.filter((s) => s.status === 'completed').length;
      const healthPerStep = 100 / newSteps.length;
      const newHealth = Math.max(0, 100 - completedSteps * healthPerStep);

      return {
        ...prev,
        currentStep: stepIndex,
        steps: newSteps,
        monsterHealth: newHealth,
      };
    });
  }, []);

  const setVictory = useCallback((reward?: string) => {
    setState((prev) => ({
      ...prev,
      status: 'victory',
      monsterHealth: 0,
    }));
  }, []);

  const setDefeat = useCallback((error: string) => {
    setState((prev) => ({
      ...prev,
      status: 'defeat',
      errorMessage: error,
    }));
  }, []);

  const endBattle = useCallback(() => {
    setState(initialState);
  }, []);

  const value: BattleContextValue = {
    state,
    startBattle,
    updateStep,
    setVictory,
    setDefeat,
    endBattle,
    isActive: state.isActive,
  };

  return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
};

export const useBattleContext = (): BattleContextValue => {
  const context = useContext(BattleContext);
  if (!context) {
    throw new Error('useBattleContext must be used within BattleProvider');
  }
  return context;
};
