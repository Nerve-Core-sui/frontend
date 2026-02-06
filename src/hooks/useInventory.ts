/**
 * Hook for fetching user's inventory (tokens + positions)
 */

import { useState, useEffect, useCallback } from 'react';
import { SuiClient } from '@mysten/sui.js/client';
import { useAuth } from '@/contexts/AuthContext';
import { InventoryData, InventoryItem, ItemRarity, TokenItem, PositionItem } from '@/types/inventory';
import { formatTokenAmount } from '@/lib/contracts';

const RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443';

// Determine rarity based on USD value
function getRarityByValue(usdValue: number): ItemRarity {
  if (usdValue >= 10000) return 'legendary';
  if (usdValue >= 5000) return 'epic';
  if (usdValue >= 1000) return 'rare';
  return 'common';
}

// Mock USD prices for demo
const MOCK_PRICES = {
  MSUI: 0.5,
  MUSDC: 1.0,
};

export function useInventory() {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<InventoryData>({
    items: [],
    totalValue: 0,
    tokenCount: 0,
    positionCount: 0,
    isLoading: true,
    error: null,
  });

  const fetchInventory = useCallback(async () => {
    if (!isAuthenticated || !user?.address) {
      setData({
        items: [],
        totalValue: 0,
        tokenCount: 0,
        positionCount: 0,
        isLoading: false,
        error: null,
      });
      return;
    }

    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      const client = new SuiClient({ url: RPC_URL });
      const items: InventoryItem[] = [];
      let totalValue = 0;

      // Fetch all objects owned by user
      const ownedObjects = await client.getOwnedObjects({
        owner: user.address,
        options: {
          showType: true,
          showContent: true,
          showDisplay: true,
        },
      });

      // Process each object
      for (const obj of ownedObjects.data) {
        if (!obj.data || !obj.data.type) continue;

        const objectType = obj.data.type;
        const content = obj.data.content;

        // Check if it's a token (MSUI or MUSDC)
        if (objectType.includes('::msui::MSUI') && content && 'fields' in content) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const balance = (content.fields as any)?.balance || '0';
          const balanceFormatted = formatTokenAmount(balance);
          const usdValue = parseFloat(balanceFormatted) * MOCK_PRICES.MSUI;

          const tokenItem: TokenItem = {
            type: 'token',
            id: obj.data.objectId,
            symbol: 'MSUI',
            name: 'Mock SUI Token',
            balance,
            balanceFormatted,
            usdValue,
            rarity: getRarityByValue(usdValue),
            icon: 'gold',
          };

          items.push(tokenItem);
          totalValue += usdValue;
        } else if (objectType.includes('::musdc::MUSDC') && content && 'fields' in content) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const balance = (content.fields as any)?.balance || '0';
          const balanceFormatted = formatTokenAmount(balance);
          const usdValue = parseFloat(balanceFormatted) * MOCK_PRICES.MUSDC;

          const tokenItem: TokenItem = {
            type: 'token',
            id: obj.data.objectId,
            symbol: 'MUSDC',
            name: 'Mock USD Coin',
            balance,
            balanceFormatted,
            usdValue,
            rarity: getRarityByValue(usdValue),
            icon: 'silver',
          };

          items.push(tokenItem);
          totalValue += usdValue;
        }
        // Check if it's a lending position receipt
        else if (objectType.includes('::lending::LendingReceipt') && content && 'fields' in content) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fields = content.fields as any;
          const depositAmount = fields.deposit_amount || '0';
          const borrowedAmount = fields.borrowed_amount || '0';
          const depositTimestamp = fields.deposit_timestamp || '0';

          // Calculate earned yield (mock: 5% APY)
          const depositFloat = parseFloat(formatTokenAmount(depositAmount));
          const earnedYield = depositFloat * 0.05; // 5% mock yield
          const currentValue = depositFloat + earnedYield;

          // Health factor calculation (simplified)
          const borrowedFloat = parseFloat(formatTokenAmount(borrowedAmount));
          const healthFactor = borrowedFloat > 0 ? (currentValue / borrowedFloat) * 100 : 999;

          const usdValue = currentValue * MOCK_PRICES.MSUI;

          const positionItem: PositionItem = {
            type: 'position',
            id: obj.data.objectId,
            name: 'Lending Position',
            depositAmount,
            depositAmountFormatted: formatTokenAmount(depositAmount),
            borrowedAmount,
            borrowedAmountFormatted: formatTokenAmount(borrowedAmount),
            currentValue: (currentValue * 1e9).toString(),
            currentValueFormatted: currentValue.toFixed(4),
            healthFactor,
            earnedYield: (earnedYield * 1e9).toString(),
            earnedYieldFormatted: earnedYield.toFixed(4),
            rarity: getRarityByValue(usdValue),
            depositTimestamp,
          };

          items.push(positionItem);
          totalValue += usdValue;
        }
      }

      // Sort items by rarity (legendary first)
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
      items.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

      setData({
        items,
        totalValue,
        tokenCount: items.filter(i => i.type === 'token').length,
        positionCount: items.filter(i => i.type === 'position').length,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch inventory',
      }));
    }
  }, [isAuthenticated, user?.address]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    ...data,
    refetch: fetchInventory,
  };
}
