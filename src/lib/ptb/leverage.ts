/**
 * Leverage PTB Builder - The FLAGSHIP Sui PTB demonstration
 *
 * This demonstrates the power of Sui's Programmable Transaction Blocks:
 * 4 DeFi operations in 1 atomic transaction!
 *
 * Flow:
 * 1. Deposit MSUI as collateral
 * 2. Borrow MUSDC (80% of collateral value)
 * 3. Swap MUSDC -> MSUI
 * 4. Deposit swapped MSUI as additional collateral
 *
 * Result: ~1.8x leverage on initial position
 */

import { Transaction } from '@mysten/sui/transactions';
import {
  PACKAGE_ID,
  LENDING_POOL,
  SWAP_POOL,
  CLOCK_OBJECT,
  TOKEN_DECIMALS,
} from '@/lib/contracts';

// Leverage constants
export const COLLATERAL_FACTOR = 0.8; // 80% LTV
export const SWAP_SLIPPAGE = 0.02; // 2% slippage tolerance
export const LEVERAGE_MULTIPLIER = 1.8; // Approximate final leverage

export interface LeverageCalculation {
  initialAmount: bigint;
  borrowAmount: bigint;
  expectedSwapOut: bigint;
  minSwapOut: bigint;
  finalExposure: bigint;
  leverageMultiplier: number;
  healthFactor: number;
}

export interface LeverageStep {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const LEVERAGE_STEPS: LeverageStep[] = [
  {
    id: 'deposit-collateral',
    name: 'Deposit Collateral',
    description: 'Depositing MSUI as initial collateral...',
    icon: '💎',
  },
  {
    id: 'borrow-funds',
    name: 'Borrow Funds',
    description: 'Borrowing MUSDC against collateral...',
    icon: '🏦',
  },
  {
    id: 'swap-tokens',
    name: 'Swap Tokens',
    description: 'Swapping MUSDC back to MSUI...',
    icon: '🔄',
  },
  {
    id: 'reinforce-position',
    name: 'Reinforce Position',
    description: 'Depositing swapped MSUI as additional collateral...',
    icon: '⚡',
  },
];

/**
 * Calculate leverage position details
 *
 * @param initialAmount - Initial MSUI amount in base units
 * @param msuiPrice - MSUI price in MUSDC (default 1:1 for mock)
 * @returns Calculated leverage details
 */
export function calculateLeverage(
  initialAmount: bigint,
  msuiPrice: number = 1.0
): LeverageCalculation {
  // Calculate borrow amount (80% of collateral value in MUSDC)
  const collateralValueMusdc = Number(initialAmount) * msuiPrice;
  const borrowAmountNumber = Math.floor(collateralValueMusdc * COLLATERAL_FACTOR);
  const borrowAmount = BigInt(borrowAmountNumber);

  // Calculate expected swap output (MUSDC -> MSUI)
  // Assume 1:1 rate with some slippage for mock tokens
  const expectedSwapOutNumber = Math.floor(borrowAmountNumber / msuiPrice);
  const expectedSwapOut = BigInt(expectedSwapOutNumber);

  // Apply slippage for minimum output
  const minSwapOutNumber = Math.floor(expectedSwapOutNumber * (1 - SWAP_SLIPPAGE));
  const minSwapOut = BigInt(minSwapOutNumber);

  // Calculate final exposure
  const finalExposure = initialAmount + expectedSwapOut;

  // Calculate actual leverage multiplier
  const leverageMultiplier = Number(finalExposure) / Number(initialAmount);

  // Health factor = collateral value / borrowed value
  // With 80% LTV, initial health factor is 1.25
  const healthFactor = Number(finalExposure) / (Number(borrowAmount) / msuiPrice);

  return {
    initialAmount,
    borrowAmount,
    expectedSwapOut,
    minSwapOut,
    finalExposure,
    leverageMultiplier,
    healthFactor,
  };
}

/**
 * Build the leverage transaction using Sui PTB
 *
 * This is the FLAGSHIP demonstration of Sui's PTB power:
 * - 4 complex DeFi operations
 * - 1 atomic transaction
 * - All-or-nothing execution (if ANY step fails, entire tx reverts)
 *
 * @param msuiCoinId - Object ID of the MSUI coin to use
 * @param amount - Amount of MSUI to leverage
 * @returns Transaction object ready for signing
 */
export function buildLeverageTransaction(
  msuiCoinId: string,
  amount: bigint
): Transaction {
  const tx = new Transaction();

  // Calculate leverage parameters
  const calculation = calculateLeverage(amount);

  // ============================================
  // STEP 1: Deposit MSUI as initial collateral
  // ============================================
  // This creates a lending receipt that tracks our position
  const [depositReceipt] = tx.moveCall({
    target: `${PACKAGE_ID}::lending::deposit`,
    arguments: [
      tx.object(LENDING_POOL),
      tx.object(msuiCoinId),
      tx.object(CLOCK_OBJECT),
    ],
  });

  // ============================================
  // STEP 2: Borrow MUSDC against our collateral
  // ============================================
  // We can borrow up to 80% of our collateral value
  const [borrowedMusdc] = tx.moveCall({
    target: `${PACKAGE_ID}::lending::borrow`,
    arguments: [
      tx.object(LENDING_POOL),
      depositReceipt,
      tx.pure.u64(calculation.borrowAmount),
    ],
  });

  // ============================================
  // STEP 3: Swap borrowed MUSDC back to MSUI
  // ============================================
  // This gives us more MSUI to add to our position
  const [swappedMsui] = tx.moveCall({
    target: `${PACKAGE_ID}::swap::swap_musdc_to_msui`,
    arguments: [
      tx.object(SWAP_POOL),
      borrowedMusdc,
      tx.pure.u64(calculation.minSwapOut),
    ],
  });

  // ============================================
  // STEP 4: Deposit swapped MSUI as additional collateral
  // ============================================
  // This increases our total position, creating leverage!
  tx.moveCall({
    target: `${PACKAGE_ID}::lending::deposit`,
    arguments: [
      tx.object(LENDING_POOL),
      swappedMsui,
      tx.object(CLOCK_OBJECT),
    ],
  });

  return tx;
}

/**
 * Build leverage transaction with split coin
 * Use this when you want to leverage only part of a coin
 *
 * @param coinId - Object ID of the source coin
 * @param amount - Amount to split and leverage
 * @returns Transaction object
 */
export function buildLeverageTransactionWithSplit(
  coinId: string,
  amount: bigint
): Transaction {
  const tx = new Transaction();

  // Calculate leverage parameters
  const calculation = calculateLeverage(amount);

  // Split the exact amount we want to leverage
  const [msuiCoin] = tx.splitCoins(tx.object(coinId), [tx.pure.u64(amount)]);

  // Step 1: Deposit MSUI as initial collateral
  const [depositReceipt] = tx.moveCall({
    target: `${PACKAGE_ID}::lending::deposit`,
    arguments: [
      tx.object(LENDING_POOL),
      msuiCoin,
      tx.object(CLOCK_OBJECT),
    ],
  });

  // Step 2: Borrow MUSDC against our collateral
  const [borrowedMusdc] = tx.moveCall({
    target: `${PACKAGE_ID}::lending::borrow`,
    arguments: [
      tx.object(LENDING_POOL),
      depositReceipt,
      tx.pure.u64(calculation.borrowAmount),
    ],
  });

  // Step 3: Swap borrowed MUSDC back to MSUI
  const [swappedMsui] = tx.moveCall({
    target: `${PACKAGE_ID}::swap::swap_musdc_to_msui`,
    arguments: [
      tx.object(SWAP_POOL),
      borrowedMusdc,
      tx.pure.u64(calculation.minSwapOut),
    ],
  });

  // Step 4: Deposit swapped MSUI as additional collateral
  tx.moveCall({
    target: `${PACKAGE_ID}::lending::deposit`,
    arguments: [
      tx.object(LENDING_POOL),
      swappedMsui,
      tx.object(CLOCK_OBJECT),
    ],
  });

  return tx;
}

/**
 * Format amount for display with proper decimals
 */
export function formatLeverageAmount(amount: bigint): string {
  const num = Number(amount) / Math.pow(10, TOKEN_DECIMALS);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

/**
 * Parse display amount to bigint
 */
export function parseLeverageAmount(displayAmount: string): bigint {
  const num = parseFloat(displayAmount.replace(/,/g, ''));
  if (isNaN(num)) return BigInt(0);
  return BigInt(Math.floor(num * Math.pow(10, TOKEN_DECIMALS)));
}
