'use client';

import { useState, useCallback, useMemo } from 'react';
import { useBattle } from '@/hooks/useBattle';
import { useAuth } from '@/contexts/AuthContext';
import {
  buildLeverageTransaction,
  buildLeverageTransactionWithSplit,
  calculateLeverage,
  formatLeverageAmount,
  parseLeverageAmount,
  LEVERAGE_STEPS,
  LeverageCalculation,
} from '@/lib/ptb/leverage';
import { BattleStep } from '@/types/battle';

export interface UseLeverageQuestOptions {
  onSuccess?: (txDigest: string) => void;
  onError?: (error: Error) => void;
}

export interface LeverageQuestState {
  isExecuting: boolean;
  currentStepIndex: number;
  error: string | null;
  txDigest: string | null;
}

export function useLeverageQuest(options: UseLeverageQuestOptions = {}) {
  const { session } = useAuth();
  const battle = useBattle();

  const [state, setState] = useState<LeverageQuestState>({
    isExecuting: false,
    currentStepIndex: -1,
    error: null,
    txDigest: null,
  });

  /**
   * Calculate leverage details for a given amount
   */
  const calculateLeverageDetails = useCallback(
    (amountStr: string): LeverageCalculation | null => {
      const amount = parseLeverageAmount(amountStr);
      if (amount <= BigInt(0)) return null;
      return calculateLeverage(amount);
    },
    []
  );

  /**
   * Get battle steps from leverage steps
   */
  const getBattleSteps = useCallback((): BattleStep[] => {
    return LEVERAGE_STEPS.map((step) => ({
      id: step.id,
      description: step.description,
      status: 'pending' as const,
    }));
  }, []);

  /**
   * Simulate step execution with delay for visual effect
   */
  const simulateStepExecution = useCallback(
    async (stepIndex: number, duration: number = 800): Promise<void> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          battle.updateStep(stepIndex, 'completed');
          resolve();
        }, duration);
      });
    },
    [battle]
  );

  /**
   * Execute the leverage quest
   * This is the main entry point for the leverage operation
   */
  const executeLeverage = useCallback(
    async (amountStr: string, msuiCoinId?: string): Promise<string | null> => {
      if (!session?.isAuthenticated) {
        const error = new Error('Please connect your wallet first');
        options.onError?.(error);
        setState((prev) => ({ ...prev, error: error.message }));
        return null;
      }

      const amount = parseLeverageAmount(amountStr);
      if (amount <= BigInt(0)) {
        const error = new Error('Please enter a valid amount');
        options.onError?.(error);
        setState((prev) => ({ ...prev, error: error.message }));
        return null;
      }

      setState({
        isExecuting: true,
        currentStepIndex: 0,
        error: null,
        txDigest: null,
      });

      // Start the battle with 4 steps
      const battleSteps = getBattleSteps();
      battle.startBattle({
        steps: battleSteps,
        monsterType: 'dragon', // Dragon for advanced quest
        questName: 'Leverage Quest',
      });

      try {
        // Build the PTB transaction
        // In a real implementation, we'd use the actual coin ID
        const tx = msuiCoinId
          ? buildLeverageTransaction(msuiCoinId, amount)
          : buildLeverageTransactionWithSplit(
              '0x0', // Placeholder - would be actual coin ID
              amount
            );

        // Simulate each step for visual effect
        // In production, we'd track actual on-chain execution

        // Step 1: Deposit Collateral
        battle.updateStep(0, 'in-progress');
        setState((prev) => ({ ...prev, currentStepIndex: 0 }));
        await simulateStepExecution(0, 1000);

        // Step 2: Borrow Funds
        battle.updateStep(1, 'in-progress');
        setState((prev) => ({ ...prev, currentStepIndex: 1 }));
        await simulateStepExecution(1, 1200);

        // Step 3: Swap Tokens
        battle.updateStep(2, 'in-progress');
        setState((prev) => ({ ...prev, currentStepIndex: 2 }));
        await simulateStepExecution(2, 1000);

        // Step 4: Reinforce Position
        battle.updateStep(3, 'in-progress');
        setState((prev) => ({ ...prev, currentStepIndex: 3 }));
        await simulateStepExecution(3, 800);

        // In production, we'd execute the transaction here:
        // const result = await suiClient.signAndExecuteTransaction({
        //   transaction: tx,
        //   signer: keypair,
        // });

        // Simulate transaction digest
        const mockTxDigest = `0x${Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`;

        // Victory!
        battle.setVictory('~1.8x Exposure Achieved!');

        setState({
          isExecuting: false,
          currentStepIndex: -1,
          error: null,
          txDigest: mockTxDigest,
        });

        options.onSuccess?.(mockTxDigest);
        return mockTxDigest;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Transaction failed';

        // If ANY step fails, the entire transaction reverts
        // This is the power of atomic PTB!
        battle.setDefeat(
          'Transaction reverted - Your funds are safe!'
        );

        setState({
          isExecuting: false,
          currentStepIndex: -1,
          error: errorMessage,
          txDigest: null,
        });

        options.onError?.(new Error(errorMessage));
        return null;
      }
    },
    [session, battle, getBattleSteps, simulateStepExecution, options]
  );

  /**
   * Reset the quest state
   */
  const reset = useCallback(() => {
    setState({
      isExecuting: false,
      currentStepIndex: -1,
      error: null,
      txDigest: null,
    });
    battle.endBattle();
  }, [battle]);

  /**
   * Formatted leverage info for display
   */
  const getLeverageInfo = useCallback(
    (amountStr: string) => {
      const calc = calculateLeverageDetails(amountStr);
      if (!calc) {
        return {
          initialDisplay: '0',
          borrowDisplay: '0',
          finalDisplay: '0',
          multiplier: '0x',
          healthFactor: '0',
        };
      }

      return {
        initialDisplay: formatLeverageAmount(calc.initialAmount),
        borrowDisplay: formatLeverageAmount(calc.borrowAmount),
        finalDisplay: formatLeverageAmount(calc.finalExposure),
        multiplier: `${calc.leverageMultiplier.toFixed(2)}x`,
        healthFactor: calc.healthFactor.toFixed(2),
      };
    },
    [calculateLeverageDetails]
  );

  return {
    // State
    isExecuting: state.isExecuting,
    currentStepIndex: state.currentStepIndex,
    error: state.error,
    txDigest: state.txDigest,

    // Battle state
    battleState: battle.state,
    isBattleActive: battle.isActive,

    // Actions
    executeLeverage,
    calculateLeverageDetails,
    getLeverageInfo,
    reset,

    // Constants
    steps: LEVERAGE_STEPS,
  };
}
