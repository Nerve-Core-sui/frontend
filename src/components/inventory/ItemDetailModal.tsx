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
    <Modal isOpen={isOpen} onClose={onClose} title="Item Details">
      <div className="space-y-6">
        {/* Item header */}
        <div className="flex items-center gap-4 p-4 bg-surface-elevated rounded-2xl">
          <div
            className={clsx(
              'w-16 h-16 rounded-full flex items-center justify-center',
              isToken ? 'bg-accent/20' : 'bg-success/20'
            )}
          >
            {isToken ? (
              <Coins className="w-8 h-8 text-accent" />
            ) : (
              <Shield className="w-8 h-8 text-success" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-text-primary">
                {isToken ? tokenItem?.symbol : positionItem?.name}
              </h3>
              <span
                className={clsx(
                  'px-2 py-0.5 text-xs rounded-full',
                  item.rarity === 'legendary' && 'bg-warning/20 text-warning',
                  item.rarity === 'epic' && 'bg-accent/20 text-accent',
                  item.rarity === 'rare' && 'bg-blue-500/20 text-blue-400',
                  item.rarity === 'common' && 'bg-surface text-text-muted'
                )}
              >
                {item.rarity}
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              {isToken ? tokenItem?.name : 'Lending Position'}
            </p>
          </div>
        </div>

        {/* Token details */}
        {isToken && tokenItem && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-surface-elevated rounded-xl">
                <p className="text-xs text-text-muted mb-1">Balance</p>
                <p className="text-xl font-semibold text-text-primary">
                  {tokenItem.balanceFormatted}
                </p>
                <p className="text-xs text-text-muted">{tokenItem.symbol}</p>
              </div>

              {tokenItem.usdValue !== undefined && (
                <div className="p-4 bg-surface-elevated rounded-xl">
                  <p className="text-xs text-text-muted mb-1">USD Value</p>
                  <p className="text-xl font-semibold text-success">
                    ${tokenItem.usdValue.toFixed(2)}
                  </p>
                  <p className="text-xs text-text-muted">Estimated</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-surface-elevated rounded-xl">
              <p className="text-xs text-text-muted mb-2">Object ID</p>
              <p className="text-xs font-mono text-text-secondary break-all">
                {tokenItem.id}
              </p>
            </div>
          </div>
        )}

        {/* Position details */}
        {!isToken && positionItem && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-surface-elevated rounded-xl">
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  Deposited
                </p>
                <p className="text-lg font-semibold text-text-primary">
                  {positionItem.depositAmountFormatted}
                </p>
                <p className="text-xs text-text-muted">MSUI</p>
              </div>

              <div className="p-4 bg-surface-elevated rounded-xl">
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Earned Yield
                </p>
                <p className="text-lg font-semibold text-success">
                  +{positionItem.earnedYieldFormatted}
                </p>
                <p className="text-xs text-text-muted">MSUI</p>
              </div>

              <div className="p-4 bg-surface-elevated rounded-xl">
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Current Value
                </p>
                <p className="text-lg font-semibold text-accent">
                  {positionItem.currentValueFormatted}
                </p>
                <p className="text-xs text-text-muted">MSUI</p>
              </div>

              <div className="p-4 bg-surface-elevated rounded-xl">
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Health Factor
                </p>
                <p
                  className={clsx(
                    'text-lg font-semibold',
                    positionItem.healthFactor > 200 ? 'text-success' :
                    positionItem.healthFactor > 120 ? 'text-warning' : 'text-error'
                  )}
                >
                  {positionItem.healthFactor.toFixed(0)}%
                </p>
                <p className="text-xs text-text-muted">
                  {positionItem.healthFactor > 200 ? 'Healthy' :
                   positionItem.healthFactor > 120 ? 'Caution' : 'At Risk'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-surface-elevated rounded-xl">
              <p className="text-xs text-text-muted mb-1">Borrowed Amount</p>
              <p className="text-lg font-semibold text-error">
                {positionItem.borrowedAmountFormatted} MUSDC
              </p>
            </div>

            <div className="p-4 bg-surface-elevated rounded-xl">
              <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Deposit Time
              </p>
              <p className="text-sm text-text-secondary">
                {new Date(parseInt(positionItem.depositTimestamp) * 1000).toLocaleString()}
              </p>
            </div>

            <div className="p-4 bg-surface-elevated rounded-xl">
              <p className="text-xs text-text-muted mb-2">Receipt ID</p>
              <p className="text-xs font-mono text-text-secondary break-all">
                {positionItem.id}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          {isToken ? (
            <>
              <Button
                variant="secondary"
                size="md"
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
              <Button variant="ghost" size="md" className="flex-1" onClick={onClose}>
                Close
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="danger"
                size="md"
                className="flex-1"
                onClick={() => {
                  if (onWithdraw && positionItem) {
                    onWithdraw(positionItem.id);
                  }
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
              <Button variant="ghost" size="md" className="flex-1" onClick={onClose}>
                Close
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
