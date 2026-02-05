/**
 * Inventory types for RPG-styled portfolio display
 */

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface TokenItem {
  type: 'token';
  id: string;
  symbol: string;
  name: string;
  balance: string;
  balanceFormatted: string;
  usdValue?: number;
  rarity: ItemRarity;
  icon: 'gold' | 'silver';
}

export interface PositionItem {
  type: 'position';
  id: string;
  name: string;
  depositAmount: string;
  depositAmountFormatted: string;
  borrowedAmount: string;
  borrowedAmountFormatted: string;
  currentValue: string;
  currentValueFormatted: string;
  healthFactor: number;
  earnedYield: string;
  earnedYieldFormatted: string;
  rarity: ItemRarity;
  depositTimestamp: string;
}

export type InventoryItem = TokenItem | PositionItem;

export interface InventoryData {
  items: InventoryItem[];
  totalValue: number;
  tokenCount: number;
  positionCount: number;
  isLoading: boolean;
  error: string | null;
}
