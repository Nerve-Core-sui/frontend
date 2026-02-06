'use client';

import { useState, useCallback } from 'react';
import { PACKAGE_ID, SWAP_POOL } from '@/lib/contracts';
import {
  buildSwapTransaction,
  calculateMinOutput,
  calculateExpectedOutput,
  parseSwapAmount,
  SwapDirection,
} from '@/lib/ptb/swap';
import { useBattle } from './useBattle';
import { BattleStep } from '@/types/battle';

export interface SwapQuote {
  inputAmount: bigint;
  expectedOutput: bigint;
  minOutput: bigint;
  priceImpact: number;
  exchangeRate: number;
}

export interface UseSwapQuestReturn {
  // Quote functions
  getQuote: (amount: string, direction: SwapDirection, slippage: number) => Promise<SwapQuote | null>;
  quote: SwapQuote | null;
  isLoadingQuote: boolean;

  // Execute swap
  executeSwap: (amount: string, slippage: number, direction: SwapDirection) => Promise<void>;
  isExecuting: boolean;
  error: string | null;

  // Transaction result
  txDigest: string | null;
  txSuccess: boolean;
}

// Mock pool reserves for demo - in production, fetch from chain
const MOCK_MSUI_RESERVE = BigInt(1000000 * 10 ** 9); // 1M MSUI
const MOCK_MUSDC_RESERVE = BigInt(2000000 * 10 ** 9); // 2M MUSDC

export const useSwapQuest = (): UseSwapQuestReturn => {
  // Mock implementations - in production these would use @mysten/dapp-kit
  // const account = useCurrentAccount();
  // const suiClient = useSuiClient();
  // const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const battle = useBattle();

  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState(false);

  /**
   * Get a price quote for the swap
   */
  const getQuote = useCallback(
    async (amount: string, direction: SwapDirection, slippage: number): Promise<SwapQuote | null> => {
      setIsLoadingQuote(true);
      setError(null);

      try {
        const inputAmount = parseSwapAmount(amount);
        if (inputAmount === BigInt(0)) {
          throw new Error('Invalid amount');
        }

        // Determine reserves based on direction
        const inputReserve = direction === 'msui_to_musdc' ? MOCK_MSUI_RESERVE : MOCK_MUSDC_RESERVE;
        const outputReserve = direction === 'msui_to_musdc' ? MOCK_MUSDC_RESERVE : MOCK_MSUI_RESERVE;

        // Calculate expected output
        const expectedOutput = calculateExpectedOutput(inputAmount, inputReserve, outputReserve);

        // Calculate minimum output with slippage
        const minOutput = calculateMinOutput(expectedOutput, slippage);

        // Calculate price impact
        const priceImpact = Number(inputAmount * BigInt(10000) / inputReserve) / 100;

        // Calculate exchange rate
        const exchangeRate = Number(expectedOutput) / Number(inputAmount);

        const quoteData: SwapQuote = {
          inputAmount,
          expectedOutput,
          minOutput,
          priceImpact,
          exchangeRate,
        };

        setQuote(quoteData);
        return quoteData;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get quote';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoadingQuote(false);
      }
    },
    []
  );

  /**
   * Execute the swap transaction with battle animation
   */
  const executeSwap = useCallback(
    async (amount: string, slippage: number, direction: SwapDirection) => {
      // Mock implementation - wallet connection check would be here
      // if (!account) {
      //   setError('Please connect your wallet');
      //   return;
      // }

      setIsExecuting(true);
      setError(null);
      setTxSuccess(false);

      try {
        // Parse amount
        const inputAmount = parseSwapAmount(amount);
        if (inputAmount === BigInt(0)) {
          throw new Error('Invalid amount');
        }

        // Get quote
        const quoteData = await getQuote(amount, direction, slippage);
        if (!quoteData) {
          throw new Error('Failed to get quote');
        }

        // Define battle steps
        const battleSteps: BattleStep[] = [
          {
            id: 'prepare',
            description: 'Preparing swap transaction...',
            status: 'pending',
          },
          {
            id: 'execute',
            description: 'Executing swap on-chain...',
            status: 'pending',
          },
          {
            id: 'confirm',
            description: 'Confirming transaction...',
            status: 'pending',
          },
        ];

        // Start battle animation
        battle.startBattle({
          steps: battleSteps,
          monsterType: 'merchant',
          questName: 'Token Swap Quest',
        });

        // Step 1: Prepare transaction
        battle.updateStep(0, 'in-progress');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const tx = buildSwapTransaction(
          PACKAGE_ID,
          SWAP_POOL,
          inputAmount,
          quoteData.minOutput,
          direction
        );
        battle.updateStep(0, 'completed');

        // Step 2: Execute transaction (Mock for demo)
        battle.updateStep(1, 'in-progress');

        // Simulate transaction execution delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock transaction digest
        const mockDigest = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setTxDigest(mockDigest);
        battle.updateStep(1, 'completed');

        // Step 3: Wait for confirmation
        battle.updateStep(2, 'in-progress');

        // Simulate confirmation delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        battle.updateStep(2, 'completed');
        setTxSuccess(true);

        // Victory!
        setTimeout(() => {
          battle.setVictory();
        }, 500);

        // Note: In production, replace this mock with actual wallet integration:
        // import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
        // const { mutate: signAndExecute } = useSignAndExecuteTransaction();
        // const suiClient = useSuiClient();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Swap failed';
        setError(errorMessage);

        // Update current step as failed
        const currentStepIndex = battle.state.currentStep;
        battle.updateStep(currentStepIndex, 'failed');

        // Show defeat
        setTimeout(() => {
          battle.setDefeat(errorMessage);
        }, 500);
      } finally {
        setIsExecuting(false);
      }
    },
    [battle, getQuote]
  );

  return {
    getQuote,
    quote,
    isLoadingQuote,
    executeSwap,
    isExecuting,
    error,
    txDigest,
    txSuccess,
  };
};
