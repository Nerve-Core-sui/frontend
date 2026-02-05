/**
 * Yield Quest PTB (Programmable Transaction Block) builders
 * Handles deposit and withdraw operations for the lending pool
 */

import { Transaction } from '@mysten/sui/transactions';

/**
 * Build transaction to deposit MSUI into lending pool
 * @param packageId - Contract package ID
 * @param poolId - Lending pool object ID
 * @param msuiCoinId - MSUI coin object ID to deposit
 * @param clockId - Clock object ID (0x6)
 * @returns Transaction ready to be signed and executed
 */
export function buildDepositTransaction(
  packageId: string,
  poolId: string,
  msuiCoinId: string,
  clockId: string = '0x6'
): Transaction {
  const tx = new Transaction();

  // Call lending::deposit function
  // Returns a DepositReceipt NFT that represents the deposit
  tx.moveCall({
    target: `${packageId}::lending::deposit`,
    arguments: [
      tx.object(poolId),
      tx.object(msuiCoinId),
      tx.object(clockId),
    ],
  });

  return tx;
}

/**
 * Build transaction to withdraw MSUI from lending pool
 * @param packageId - Contract package ID
 * @param poolId - Lending pool object ID
 * @param receiptId - Deposit receipt NFT object ID
 * @returns Transaction ready to be signed and executed
 */
export function buildWithdrawTransaction(
  packageId: string,
  poolId: string,
  receiptId: string
): Transaction {
  const tx = new Transaction();

  // Call lending::withdraw function
  // Burns the receipt and returns the deposited MSUI plus accrued interest
  tx.moveCall({
    target: `${packageId}::lending::withdraw`,
    arguments: [
      tx.object(poolId),
      tx.object(receiptId),
    ],
  });

  return tx;
}

/**
 * Estimate earnings based on deposit amount and APY
 * @param depositAmount - Amount deposited in tokens (not in smallest unit)
 * @param apyPercent - Annual Percentage Yield as percentage (e.g., 5 for 5%)
 * @param durationDays - Duration in days
 * @returns Estimated earnings in tokens
 */
export function estimateEarnings(
  depositAmount: number,
  apyPercent: number,
  durationDays: number = 365
): number {
  const dailyRate = apyPercent / 100 / 365;
  return depositAmount * dailyRate * durationDays;
}

/**
 * Format APY display
 * @param apy - APY as percentage (e.g., 5.25)
 * @returns Formatted string (e.g., "5.25%")
 */
export function formatAPY(apy: number): string {
  return `${apy.toFixed(2)}%`;
}
