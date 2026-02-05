export type BattleStatus = 'idle' | 'fighting' | 'victory' | 'defeat';

export type MonsterType = 'merchant' | 'golem' | 'dragon';

export interface BattleStep {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  timestamp?: number;
}

export interface BattleState {
  isActive: boolean;
  status: BattleStatus;
  currentStep: number;
  steps: BattleStep[];
  monsterType: MonsterType;
  questName: string;
  monsterHealth: number;
  errorMessage?: string;
}

export interface BattleContextValue {
  state: BattleState;
  startBattle: (config: {
    steps: BattleStep[];
    monsterType: MonsterType;
    questName: string;
  }) => void;
  updateStep: (stepIndex: number, status: BattleStep['status']) => void;
  setVictory: (reward?: string) => void;
  setDefeat: (error: string) => void;
  endBattle: () => void;
  isActive: boolean;
}
