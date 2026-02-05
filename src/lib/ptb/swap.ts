import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, SWAP_POOL } from '../contracts';

export type SwapDirection = 'msui_to_musdc' | 'musdc_to_msui';

/**
 * Build a swap transaction for exchanging tokens
 * @param packageId - The package ID of the deployed contract
 * @param poolId - The swap pool object ID
 * @param amount - Amount to swap (in smallest units, e.g., 9 decimals)
 * @param minOutput - Minimum expected output after slippage (in smallest units)
 * @param direction - Swap direction: msui_to_musdc or musdc_to_msui
 * @returns Transaction object ready to be signed and executed
 */
export function buildSwapTransaction(
  packageId: string,
  poolId: string,
  amount: bigint,
  minOutput: bigint,
  direction: SwapDirection
): Transaction {
  const tx = new Transaction();

  if (direction === 'msui_to_musdc') {
    // For MSUI -> MUSDC swap, we need to split the coin first
    const [coin] = tx.splitCoins(tx.gas, [amount]);

    tx.moveCall({
      target: `${packageId}::swap::swap_msui_to_musdc_entry`,
      arguments: [
        tx.object(poolId),
        coin,
        tx.pure.u64(minOutput),
      ],
    });
  } else {
    // For MUSDC -> MSUI swap, we need to get the user's MUSDC coin
    // Note: In a real implementation, you'd pass the coin object ID
    // For now, we'll use a placeholder that needs to be filled
    tx.moveCall({
      target: `${packageId}::swap::swap_musdc_to_msui_entry`,
      arguments: [
        tx.object(poolId),
        tx.object('MUSDC_COIN_OBJECT_ID'), // This should be passed as parameter
        tx.pure.u64(minOutput),
      ],
    });
  }

  return tx;
}

/**
 * Build a swap transaction with coin object ID for MUSDC swaps
 */
export function buildSwapTransactionWithCoin(
  packageId: string,
  poolId: string,
  coinObjectId: string,
  minOutput: bigint,
  direction: SwapDirection
): Transaction {
  const tx = new Transaction();

  if (direction === 'msui_to_musdc') {
    tx.moveCall({
      target: `${packageId}::swap::swap_msui_to_musdc_entry`,
      arguments: [
        tx.object(poolId),
        tx.object(coinObjectId),
        tx.pure.u64(minOutput),
      ],
    });
  } else {
    tx.moveCall({
      target: `${packageId}::swap::swap_musdc_to_msui_entry`,
      arguments: [
        tx.object(poolId),
        tx.object(coinObjectId),
        tx.pure.u64(minOutput),
      ],
    });
  }

  return tx;
}

/**
 * Calculate minimum output with slippage tolerance
 * @param expectedOutput - Expected output amount
 * @param slippagePercent - Slippage tolerance as percentage (0.5, 1, 2, etc.)
 * @returns Minimum output after applying slippage
 */
export function calculateMinOutput(expectedOutput: bigint, slippagePercent: number): bigint {
  const slippageFactor = BigInt(Math.floor((100 - slippagePercent) * 100));
  return (expectedOutput * slippageFactor) / BigInt(10000);
}

/**
 * Calculate expected output for a swap (simple constant product formula)
 * This is a basic implementation - in production, you'd query the actual pool state
 * @param inputAmount - Amount being swapped in
 * @param inputReserve - Reserve of input token in pool
 * @param outputReserve - Reserve of output token in pool
 * @param feePercent - Trading fee as percentage (e.g., 0.3 for 0.3%)
 * @returns Expected output amount
 */
export function calculateExpectedOutput(
  inputAmount: bigint,
  inputReserve: bigint,
  outputReserve: bigint,
  feePercent: number = 0.3
): bigint {
  if (inputReserve === BigInt(0) || outputReserve === BigInt(0)) {
    return BigInt(0);
  }

  // Apply fee
  const feeMultiplier = BigInt(Math.floor((100 - feePercent) * 100));
  const inputWithFee = (inputAmount * feeMultiplier) / BigInt(10000);

  // Constant product formula: (x + Δx)(y - Δy) = xy
  // Δy = y * Δx / (x + Δx)
  const numerator = outputReserve * inputWithFee;
  const denominator = inputReserve + inputWithFee;

  return numerator / denominator;
}

/**
 * Format swap amounts for display
 */
export function formatSwapAmount(amount: bigint, decimals: number = 9): string {
  const num = Number(amount) / Math.pow(10, decimals);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

/**
 * Parse user input to swap amount
 */
export function parseSwapAmount(input: string, decimals: number = 9): bigint {
  const num = parseFloat(input);
  if (isNaN(num) || num <= 0) {
    return BigInt(0);
  }
  return BigInt(Math.floor(num * Math.pow(10, decimals)));
}
