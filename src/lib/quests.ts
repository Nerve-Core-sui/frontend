export type QuestDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type QuestRisk = 'low' | 'medium' | 'high';

export interface QuestStep {
  description: string;
  icon: string;
}

export interface Quest {
  id: string;
  title: string;
  icon: string;
  description: string;
  difficulty: QuestDifficulty;
  risk: QuestRisk;
  steps: QuestStep[];
  estimatedReward: string;
  category: string;
}

export const QUESTS: Quest[] = [
  {
    id: 'swap',
    title: 'Token Swap Quest',
    icon: '🔄',
    description: 'Exchange your tokens at the mystical market. Learn the ancient art of token swapping.',
    difficulty: 'beginner',
    risk: 'low',
    category: 'trading',
    estimatedReward: '50-100 GOLD',
    steps: [
      {
        icon: '💰',
        description: 'Select MSUI token from your treasury',
      },
      {
        icon: '🔄',
        description: 'Swap MSUI → MUSDC at market rates',
      },
      {
        icon: '✨',
        description: 'Receive MUSDC tokens and claim rewards',
      },
    ],
  },
  {
    id: 'yield',
    title: 'Yield Farming Quest',
    icon: '💰',
    description: 'Deposit tokens into the sacred vault and watch your wealth grow over time.',
    difficulty: 'beginner',
    risk: 'low',
    category: 'farming',
    estimatedReward: '100-200 GOLD',
    steps: [
      {
        icon: '🏦',
        description: 'Choose your deposit amount of MSUI',
      },
      {
        icon: '📜',
        description: 'Deposit into the lending vault',
      },
      {
        icon: '🎫',
        description: 'Receive vault receipt token',
      },
      {
        icon: '📈',
        description: 'Watch your balance grow with interest',
      },
    ],
  },
  {
    id: 'leverage',
    title: 'Leverage Quest',
    icon: '⚔️',
    description: 'Master the dangerous art of leveraged positions. Multiply your power, but beware the risks!',
    difficulty: 'advanced',
    risk: 'medium',
    category: 'advanced',
    estimatedReward: '300-500 GOLD',
    steps: [
      {
        icon: '💎',
        description: 'Deposit MSUI as initial collateral',
      },
      {
        icon: '🏦',
        description: 'Borrow additional MUSDC from the vault',
      },
      {
        icon: '🔄',
        description: 'Swap borrowed MUSDC back to MSUI',
      },
      {
        icon: '⚡',
        description: 'Deposit again to amplify position',
      },
      {
        icon: '⚠️',
        description: 'Monitor health factor carefully!',
      },
    ],
  },
  {
    id: 'liquidity',
    title: 'Liquidity Provider Quest',
    icon: '🌊',
    description: 'Become a market maker by providing liquidity to the trading pools.',
    difficulty: 'intermediate',
    risk: 'medium',
    category: 'liquidity',
    estimatedReward: '150-300 GOLD',
    steps: [
      {
        icon: '⚖️',
        description: 'Balance your MSUI and MUSDC tokens',
      },
      {
        icon: '🌊',
        description: 'Add liquidity to the pool',
      },
      {
        icon: '🎫',
        description: 'Receive LP tokens as proof',
      },
      {
        icon: '💹',
        description: 'Earn trading fees over time',
      },
    ],
  },
  {
    id: 'arbitrage',
    title: 'Arbitrage Hunt',
    icon: '🎯',
    description: 'Seek out price differences across markets and profit from the gaps.',
    difficulty: 'advanced',
    risk: 'high',
    category: 'advanced',
    estimatedReward: '400-800 GOLD',
    steps: [
      {
        icon: '🔍',
        description: 'Scout multiple DEX prices',
      },
      {
        icon: '⚡',
        description: 'Execute rapid multi-swap',
      },
      {
        icon: '💸',
        description: 'Capture price difference',
      },
      {
        icon: '🏃',
        description: 'Move fast before opportunity closes',
      },
    ],
  },
  {
    id: 'staking',
    title: 'Staking Ritual',
    icon: '🔮',
    description: 'Lock your tokens in the sacred shrine and receive mystical rewards.',
    difficulty: 'beginner',
    risk: 'low',
    category: 'staking',
    estimatedReward: '75-150 GOLD',
    steps: [
      {
        icon: '🔒',
        description: 'Choose staking duration',
      },
      {
        icon: '🔮',
        description: 'Lock tokens in the shrine',
      },
      {
        icon: '⏳',
        description: 'Wait for the ritual to complete',
      },
      {
        icon: '🎁',
        description: 'Claim enhanced rewards',
      },
    ],
  },
];

export const getQuestsByDifficulty = (difficulty: QuestDifficulty): Quest[] => {
  return QUESTS.filter(quest => quest.difficulty === difficulty);
};

export const getQuestById = (id: string): Quest | undefined => {
  return QUESTS.find(quest => quest.id === id);
};

export const getQuestsByCategory = (category: string): Quest[] => {
  return QUESTS.filter(quest => quest.category === category);
};
