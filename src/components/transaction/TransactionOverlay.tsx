'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2, ArrowRight } from 'lucide-react';
import { useBattle } from '@/hooks/useBattle';
import { Button } from '@/components/ui/Button';

export const TransactionOverlay: React.FC = () => {
  const { state, endBattle } = useBattle();

  if (!state.isActive) {
    return null;
  }

  const completedSteps = state.steps.filter((s) => s.status === 'completed').length;
  const progress = (completedSteps / state.steps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Content */}
        <motion.div
          className="relative w-full max-w-lg bg-surface rounded-t-3xl p-6 pb-safe-bottom"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          {/* Drag Handle */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-1 bg-border-subtle rounded-full" />
          </div>

          {/* Victory State */}
          {state.status === 'victory' && (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 bg-success/20 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
              >
                <Check size={40} className="text-success" />
              </motion.div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Transaction Complete
              </h2>
              <p className="text-text-secondary mb-8">
                {state.questName} executed successfully
              </p>
              <Button variant="primary" size="lg" onClick={endBattle}>
                Done
              </Button>
            </motion.div>
          )}

          {/* Defeat State */}
          {state.status === 'defeat' && (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 bg-error/20 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
              >
                <X size={40} className="text-error" />
              </motion.div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Transaction Failed
              </h2>
              <p className="text-text-secondary mb-2">
                {state.questName} could not be completed
              </p>
              {state.errorMessage && (
                <p className="text-sm text-error bg-error/10 rounded-xl px-4 py-2 mb-8">
                  {state.errorMessage}
                </p>
              )}
              <Button variant="secondary" size="lg" onClick={endBattle}>
                Close
              </Button>
            </motion.div>
          )}

          {/* Processing State */}
          {state.status === 'fighting' && (
            <div className="py-4">
              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-text-primary mb-1">
                  {state.questName}
                </h2>
                <p className="text-sm text-text-secondary">
                  Processing transaction...
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-text-muted text-center mt-2">
                  {completedSteps} of {state.steps.length} steps complete
                </p>
              </div>

              {/* Steps List */}
              <div className="space-y-3">
                {state.steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className="flex items-center gap-3 p-3 bg-surface-elevated rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {step.status === 'completed' ? (
                        <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                          <Check size={16} className="text-success" />
                        </div>
                      ) : step.status === 'in-progress' ? (
                        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                          <Loader2 size={16} className="text-accent animate-spin" />
                        </div>
                      ) : step.status === 'failed' ? (
                        <div className="w-8 h-8 bg-error/20 rounded-full flex items-center justify-center">
                          <X size={16} className="text-error" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center border border-border">
                          <span className="text-xs text-text-muted">{index + 1}</span>
                        </div>
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        step.status === 'completed' ? 'text-text-primary' :
                        step.status === 'in-progress' ? 'text-accent' :
                        step.status === 'failed' ? 'text-error' :
                        'text-text-muted'
                      }`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow for pending */}
                    {step.status === 'pending' && (
                      <ArrowRight size={16} className="text-text-muted" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
