/**
 * Contract addresses and utilities for NerveCore
 * Update these after deployment
 */

import { Transaction } from '@mysten/sui/transactions';

// Contract addresses from deployment
export const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || '';
export const MSUI_TREASURY = process.env.NEXT_PUBLIC_MSUI_TREASURY || '';
export const MUSDC_TREASURY = process.env.NEXT_PUBLIC_MUSDC_TREASURY || '';
export const CLAIM_REGISTRY = process.env.NEXT_PUBLIC_CLAIM_REGISTRY || '';
export const LENDING_POOL = process.env.NEXT_PUBLIC_LENDING_POOL || '';
export const SWAP_POOL = process.env.NEXT_PUBLIC_SWAP_POOL || '';

// Clock object (standard Sui system object)
export const CLOCK_OBJECT = '0x6';

// Validate that all addresses are set
export function validateContractAddresses(): boolean {
  return !!(
    PACKAGE_ID &&
    MSUI_TREASURY &&
    MUSDC_TREASURY &&
    CLAIM_REGISTRY &&
    LENDING_POOL &&
    SWAP_POOL
  );
}

// Get all contract addresses as an object
export function getContractAddresses() {
  return {
    packageId: PACKAGE_ID,
    msuiTreasury: MSUI_TREASURY,
    musdcTreasury: MUSDC_TREASURY,
    claimRegistry: CLAIM_REGISTRY,
    lendingPool: LENDING_POOL,
    swapPool: SWAP_POOL,
    clock: CLOCK_OBJECT,
  };
}

// Token decimals
export const TOKEN_DECIMALS = 9;
export const TOKEN_MULTIPLIER = 10 ** TOKEN_DECIMALS;

// Format token amount for display
export function formatTokenAmount(amount: string | number, decimals = TOKEN_DECIMALS): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return (num / 10 ** decimals).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

// Parse token amount from display format
export function parseTokenAmount(amount: string | number, decimals = TOKEN_DECIMALS): bigint {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return BigInt(Math.floor(num * 10 ** decimals));
}

// Contract interaction helpers

/**
 * Create transaction to claim MSUI from faucet
 */
export function createFaucetMSUITransaction(): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::faucet::faucet_msui`,
    arguments: [
      tx.object(MSUI_TREASURY),
      tx.object(CLAIM_REGISTRY),
      tx.object(CLOCK_OBJECT),
    ],
  });

  return tx;
}

/**
 * Create transaction to claim MUSDC from faucet
 */
export function createFaucetMUSDCTransaction(): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::faucet::faucet_musdc`,
    arguments: [
      tx.object(MUSDC_TREASURY),
      tx.object(CLAIM_REGISTRY),
      tx.object(CLOCK_OBJECT),
    ],
  });

  return tx;
}

/**
 * Create transaction to deposit MSUI into lending pool
 */
export function createDepositTransaction(msuiCoinId: string): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::lending::deposit`,
    arguments: [
      tx.object(LENDING_POOL),
      tx.object(msuiCoinId),
      tx.object(CLOCK_OBJECT),
    ],
  });

  return tx;
}

/**
 * Create transaction to borrow MUSDC from lending pool
 */
export function createBorrowTransaction(
  receiptId: string,
  amount: bigint
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::lending::borrow`,
    arguments: [
      tx.object(LENDING_POOL),
      tx.object(receiptId),
      tx.pure.u64(amount),
    ],
  });

  return tx;
}

/**
 * Create transaction to repay MUSDC to lending pool
 */
export function createRepayTransaction(
  receiptId: string,
  musdcCoinId: string
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::lending::repay`,
    arguments: [
      tx.object(LENDING_POOL),
      tx.object(receiptId),
      tx.object(musdcCoinId),
    ],
  });

  return tx;
}

/**
 * Create transaction to withdraw MSUI from lending pool
 */
export function createWithdrawTransaction(receiptId: string): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::lending::withdraw`,
    arguments: [
      tx.object(LENDING_POOL),
      tx.object(receiptId),
    ],
  });

  return tx;
}

/**
 * Create transaction to swap MSUI for MUSDC
 */
export function createSwapMSUIToMUSDCTransaction(
  msuiCoinId: string,
  minOut: bigint
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::swap::swap_msui_to_musdc_entry`,
    arguments: [
      tx.object(SWAP_POOL),
      tx.object(msuiCoinId),
      tx.pure.u64(minOut),
    ],
  });

  return tx;
}

/**
 * Create transaction to swap MUSDC for MSUI
 */
export function createSwapMUSDCToMSUITransaction(
  musdcCoinId: string,
  minOut: bigint
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::swap::swap_musdc_to_msui_entry`,
    arguments: [
      tx.object(SWAP_POOL),
      tx.object(musdcCoinId),
      tx.pure.u64(minOut),
    ],
  });

  return tx;
}

/**
 * Create transaction to add liquidity to swap pool
 */
export function createAddLiquidityTransaction(
  msuiCoinId: string,
  musdcCoinId: string
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::swap::add_liquidity_entry`,
    arguments: [
      tx.object(SWAP_POOL),
      tx.object(msuiCoinId),
      tx.object(musdcCoinId),
    ],
  });

  return tx;
}

/**
 * Create transaction to remove liquidity from swap pool
 */
export function createRemoveLiquidityTransaction(lpReceiptId: string): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::swap::remove_liquidity_entry`,
    arguments: [
      tx.object(SWAP_POOL),
      tx.object(lpReceiptId),
    ],
  });

  return tx;
}

/**
 * Multi-step transaction example: Leverage quest
 * 1. Deposit MSUI
 * 2. Borrow MUSDC
 * 3. Swap MUSDC to MSUI
 * 4. Deposit again
 */
export function createLeverageQuestTransaction(
  initialMsuiCoinId: string,
  borrowAmount: bigint,
  minSwapOut: bigint
): Transaction {
  const tx = new Transaction();

  // Step 1: Deposit MSUI
  const [receipt] = tx.moveCall({
    target: `${PACKAGE_ID}::lending::deposit`,
    arguments: [
      tx.object(LENDING_POOL),
      tx.object(initialMsuiCoinId),
      tx.object(CLOCK_OBJECT),
    ],
  });

  // Step 2: Borrow MUSDC
  const [borrowedMusdc] = tx.moveCall({
    target: `${PACKAGE_ID}::lending::borrow`,
    arguments: [
      tx.object(LENDING_POOL),
      receipt,
      tx.pure.u64(borrowAmount),
    ],
  });

  // Step 3: Swap MUSDC to MSUI
  const [swappedMsui] = tx.moveCall({
    target: `${PACKAGE_ID}::swap::swap_musdc_to_msui`,
    arguments: [
      tx.object(SWAP_POOL),
      borrowedMusdc,
      tx.pure.u64(minSwapOut),
    ],
  });

  // Step 4: Deposit swapped MSUI
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

// Type definitions for contract objects

export interface LendingReceipt {
  id: string;
  depositor: string;
  deposit_amount: string;
  borrowed_amount: string;
  deposit_timestamp: string;
}

export interface LPReceipt {
  id: string;
  provider: string;
  lp_amount: string;
}

export interface PoolReserves {
  msui_reserve: string;
  musdc_reserve: string;
}

export interface LendingPoolStats {
  total_deposits: string;
  total_borrows: string;
  msui_reserve: string;
  musdc_reserve: string;
}
