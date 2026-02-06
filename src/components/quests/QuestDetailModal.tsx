'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, AlertCircle, ChevronRight } from 'lucide-react';
import { Quest } from '@/lib/quests';
import { Button } from '@/components/ui/Button';

export interface QuestDetailModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onStartQuest: (quest: Quest, amount: string, slippage: number) => void;
}

const difficultyColors = {
  beginner: 'bg-success/10 text-success',
  intermediate: 'bg-warning/10 text-warning',
  advanced: 'bg-error/10 text-error',
};

const riskLabels = {
  low: { label: 'Low Risk', color: 'text-success' },
  medium: { label: 'Medium Risk', color: 'text-warning' },
  high: { label: 'High Risk', color: 'text-error' },
};

export const QuestDetailModal: React.FC<QuestDetailModalProps> = ({
  quest,
  isOpen,
  onClose,
  onStartQuest,
}) => {
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);

  const handleStartQuest = () => {
    if (!quest || !amount || parseFloat(amount) <= 0) return;
    onStartQuest(quest, amount, slippage);
    onClose();
  };

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 100 || info.velocity.y > 500) {
        onClose();
      }
    },
    [onClose]
  );

  if (!quest) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <div className="bg-surface rounded-t-3xl shadow-sheet overflow-hidden">
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-border-subtle rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-elevated rounded-xl flex items-center justify-center text-xl">
                    {quest.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">
                      {quest.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[quest.difficulty]}`}>
                        {quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}
                      </span>
                      <span className={`text-xs ${riskLabels[quest.risk].color}`}>
                        {riskLabels[quest.risk].label}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-surface-elevated transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto hide-scrollbar">
                {/* Description */}
                <p className="text-sm text-text-secondary mb-6">
                  {quest.description}
                </p>

                {/* Steps */}
                <div className="mb-6">
                  <h3 className="section-header">Transaction Steps</h3>
                  <div className="space-y-2">
                    {quest.steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-surface-elevated rounded-xl"
                      >
                        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-sm">
                          {step.icon || index + 1}
                        </div>
                        <span className="flex-1 text-sm text-text-primary">
                          {step.description}
                        </span>
                        <ChevronRight size={16} className="text-text-muted" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-4">
                  <label className="section-header">Amount (SUI)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="input text-lg"
                  />
                </div>

                {/* Slippage (for swap quests) */}
                {quest.id === 'swap' && (
                  <div className="mb-4">
                    <label className="section-header">Slippage Tolerance</label>
                    <div className="flex items-center gap-2">
                      {[0.5, 1.0, 2.0].map((value) => (
                        <button
                          key={value}
                          onClick={() => setSlippage(value)}
                          className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                            slippage === value
                              ? 'bg-accent text-white'
                              : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          {value}%
                        </button>
                      ))}
                    </div>
                    <p className="flex items-center gap-1 mt-2 text-xs text-text-muted">
                      <AlertCircle size={12} />
                      Higher slippage may result in worse prices
                    </p>
                  </div>
                )}

                {/* Reward */}
                <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Estimated Reward</span>
                    <span className="text-lg font-semibold text-accent">
                      {quest.estimatedReward}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartQuest}
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  Start Transaction
                </Button>
              </div>

              {/* Safe area spacer */}
              <div className="h-safe-bottom bg-surface" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
