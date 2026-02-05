'use client';

import React from 'react';
import { Modal } from '@/components/ui';
import { InventoryItem, TokenItem, PositionItem } from '@/types/inventory';
import { Coins, Shield, ArrowRight, TrendingUp, Calendar, Activity } from 'lucide-react';
import { Button } from '@/components/ui';
import { clsx } from 'clsx';

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onWithdraw?: (itemId: string) => void;
  onTransfer?: (itemId: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  onWithdraw,
  onTransfer,
}) => {
  if (!item) return null;

  const isToken = item.type === 'token';
  const tokenItem = isToken ? (item as TokenItem) : null;
  const positionItem = !isToken ? (item as PositionItem) : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Item Details" size="md">
      <div className="space-y-6">
        {/* Item header */}
        <div className="flex items-center gap-6 p-6 bg-dark-700 rounded-lg border border-gold-500/30">
          <div
            className={clsx(
              'w-24 h-24 rounded-full flex items-center justify-center',
              'bg-gradient-to-br shadow-lg',
              isToken
                ? tokenItem?.icon === 'gold'
                  ? 'from-gold-500 to-gold-600'
                  : 'from-gray-400 to-gray-500'
                : 'from-purple-500 to-purple-600'
            )}
          >
            {isToken ? (
              <Coins className="w-12 h-12 text-dark-900" />
            ) : (
              <Shield className="w-12 h-12 text-white" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-fantasy text-gold-500">
                {isToken ? tokenItem?.symbol : positionItem?.name}
              </h3>
              <span
                className={clsx(
                  'px-3 py-1 text-xs rounded-full uppercase tracking-wider',
                  item.rarity === 'legendary' && 'bg-gradient-to-r from-gold-600 to-gold-500 text-dark-900 font-bold',
                  item.rarity === 'epic' && 'bg-purple-700 text-purple-200',
                  item.rarity === 'rare' && 'bg-blue-700 text-blue-200',
                  item.rarity === 'common' && 'bg-gray-700 text-gray-300'
                )}
              >
                {item.rarity}
              </span>
            </div>
            <p className="text-gray-400">
              {isToken ? tokenItem?.name : 'Lending Position Equipment'}
            </p>
          </div>
        </div>

        {/* Token details */}
        {isToken && tokenItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-dark-800 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Balance</p>
                <p className="text-2xl font-fantasy text-gold-500">
                  {tokenItem.balanceFormatted}
                </p>
                <p className="text-xs text-gray-500 mt-1">{tokenItem.symbol}</p>
              </div>

              {tokenItem.usdValue !== undefined && (
                <div className="p-4 bg-dark-800 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">USD Value</p>
                  <p className="text-2xl font-fantasy text-green-400">
                    ${tokenItem.usdValue.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Estimated</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-dark-800 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Object ID</p>
              <p className="text-xs font-mono text-gray-300 break-all">
                {tokenItem.id}
              </p>
            </div>
          </div>
        )}

        {/* Position details */}
        {!isToken && positionItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-dark-800 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  Deposited
                </p>
                <p className="text-xl font-fantasy text-purple-400">
                  {positionItem.depositAmountFormatted}
                </p>
                <p className="text-xs text-gray-500 mt-1">MSUI</p>
              </div>

              <div className="p-4 bg-dark-800 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Earned Yield
                </p>
                <p className="text-xl font-fantasy text-green-400">
                  +{positionItem.earnedYieldFormatted}
                </p>
                <p className="text-xs text-gray-500 mt-1">MSUI</p>
              </div>

              <div className="p-4 bg-dark-800 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  Current Value
                </p>
                <p className="text-xl font-fantasy text-gold-500">
                  {positionItem.currentValueFormatted}
                </p>
                <p className="text-xs text-gray-500 mt-1">MSUI</p>
              </div>

              <div className="p-4 bg-dark-800 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Health Factor
                </p>
                <p
                  className={clsx(
                    'text-xl font-fantasy',
                    positionItem.healthFactor > 200 ? 'text-green-400' :
                    positionItem.healthFactor > 120 ? 'text-yellow-400' : 'text-red-400'
                  )}
                >
                  {positionItem.healthFactor.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {positionItem.healthFactor > 200 ? 'Healthy' :
                   positionItem.healthFactor > 120 ? 'Caution' : 'At Risk'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-dark-800 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Borrowed Amount</p>
              <p className="text-lg font-fantasy text-red-400">
                {positionItem.borrowedAmountFormatted} MUSDC
              </p>
            </div>

            <div className="p-4 bg-dark-800 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Deposit Time
              </p>
              <p className="text-sm text-gray-300">
                {new Date(parseInt(positionItem.depositTimestamp) * 1000).toLocaleString()}
              </p>
            </div>

            <div className="p-4 bg-dark-800 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Receipt ID</p>
              <p className="text-xs font-mono text-gray-300 break-all">
                {positionItem.id}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          {isToken ? (
            <>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  if (onTransfer && tokenItem) {
                    onTransfer(tokenItem.id);
                  }
                }}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Transfer
              </Button>
              <Button variant="ghost" className="flex-1" onClick={onClose}>
                Close
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  if (onWithdraw && positionItem) {
                    onWithdraw(positionItem.id);
                  }
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Unequip (Withdraw)
              </Button>
              <Button variant="ghost" className="flex-1" onClick={onClose}>
                Close
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
