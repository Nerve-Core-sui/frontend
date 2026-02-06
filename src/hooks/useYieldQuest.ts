'use client';

import { useState, useCallback } from 'react';
import { useBattle } from './useBattle';
import { buildDepositTransaction, buildWithdrawTransaction } from '@/lib/ptb/yield';
import { PACKAGE_ID, LENDING_POOL, CLOCK_OBJECT } from '@/lib/contracts';
import { BattleStep } from '@/types/battle';

export interface DepositResult {
  success: boolean;
  receiptId?: string;
  txDigest?: string;
  error?: string;
}

export interface WithdrawResult {
  success: boolean;
  txDigest?: string;
  error?: string;
}

export interface UseYieldQuestReturn {
  deposit: (msuiCoinId: string, amount: number) => Promise<DepositResult>;
  withdraw: (receiptId: string) => Promise<WithdrawResult>;
  isProcessing: boolean;
}

/**
 * Hook for handling Yield Quest operations
 * Integrates with battle system to provide gamified UX
 */
export function useYieldQuest(): UseYieldQuestReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const { startBattle, updateStep, setVictory, setDefeat, endBattle } = useBattle();

  /**
   * Deposit MSUI into lending pool
   * Shows battle animation during transaction
   */
  const deposit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (msuiCoinId: string, amount: number): Promise<DepositResult> => {
      setIsProcessing(true);

      // Define battle steps
      const steps: BattleStep[] = [
        {
          id: 'build-transaction',
          description: 'Preparing vault deposit transaction...',
          status: 'pending',
        },
        {
          id: 'execute-deposit',
          description: 'Depositing MSUI into the sacred vault...',
          status: 'pending',
        },
      ];

      try {
        // Start battle animation
        startBattle({
          steps,
          monsterType: 'golem',
          questName: 'Yield Quest',
        });

        // Step 1: Build transaction
        updateStep(0, 'in-progress');
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Note: tx is prepared but not executed in this mock implementation
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const tx = buildDepositTransaction(
          PACKAGE_ID,
          LENDING_POOL,
          msuiCoinId,
          CLOCK_OBJECT
        );

        updateStep(0, 'completed');

        // Step 2: Execute transaction
        updateStep(1, 'in-progress');
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // TODO: Sign and execute transaction with wallet
        // For now, simulate success
        const mockReceiptId = `0x${Math.random().toString(16).slice(2)}`;
        const mockTxDigest = `0x${Math.random().toString(16).slice(2)}`;

        updateStep(1, 'completed');

        // Show victory screen
        setVictory();

        // Wait a bit before ending battle
        setTimeout(() => {
          endBattle();
          setIsProcessing(false);
        }, 2000);

        return {
          success: true,
          receiptId: mockReceiptId,
          txDigest: mockTxDigest,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setDefeat(errorMessage);

        setTimeout(() => {
          endBattle();
          setIsProcessing(false);
        }, 3000);

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [startBattle, updateStep, setVictory, setDefeat, endBattle]
  );

  /**
   * Withdraw MSUI from lending pool
   * Burns the receipt and returns deposited amount plus interest
   */
  const withdraw = useCallback(
    async (receiptId: string): Promise<WithdrawResult> => {
      setIsProcessing(true);

      const steps: BattleStep[] = [
        {
          id: 'build-transaction',
          description: 'Preparing withdrawal transaction...',
          status: 'pending',
        },
        {
          id: 'execute-withdraw',
          description: 'Withdrawing from vault with earnings...',
          status: 'pending',
        },
      ];

      try {
        startBattle({
          steps,
          monsterType: 'merchant',
          questName: 'Vault Withdrawal',
        });

        // Step 1: Build transaction
        updateStep(0, 'in-progress');
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Note: tx is prepared but not executed in this mock implementation
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const tx = buildWithdrawTransaction(PACKAGE_ID, LENDING_POOL, receiptId);

        updateStep(0, 'completed');

        // Step 2: Execute transaction
        updateStep(1, 'in-progress');
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // TODO: Sign and execute transaction with wallet
        const mockTxDigest = `0x${Math.random().toString(16).slice(2)}`;

        updateStep(1, 'completed');
        setVictory();

        setTimeout(() => {
          endBattle();
          setIsProcessing(false);
        }, 2000);

        return {
          success: true,
          txDigest: mockTxDigest,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setDefeat(errorMessage);

        setTimeout(() => {
          endBattle();
          setIsProcessing(false);
        }, 3000);

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [startBattle, updateStep, setVictory, setDefeat, endBattle]
  );

  return {
    deposit,
    withdraw,
    isProcessing,
  };
}
