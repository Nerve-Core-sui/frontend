'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertTriangle, Zap, Info } from 'lucide-react';
import { Quest } from '@/lib/quests';
import { DifficultyBadge } from './DifficultyBadge';
import { RiskIndicator } from './RiskIndicator';

export interface QuestDetailModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onStartQuest: (quest: Quest, amount: string, slippage: number) => void;
}

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
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl pointer-events-auto"
            >
              <div className={clsx(
                'relative',
                'bg-gradient-to-br from-dark-800 via-dark-800 to-dark-900',
                'border-2 border-gold-500/40',
                'rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(255,215,0,0.2)]',
                'overflow-hidden'
              )}>
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-gold-500 to-purple-500" />

                {/* Background pattern */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-50"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className={clsx(
                    'absolute top-4 right-4 z-10',
                    'w-10 h-10 rounded-full',
                    'bg-dark-900/80 border border-gold-500/30',
                    'text-gray-400 hover:text-gold-500 hover:border-gold-500/60',
                    'transition-all duration-300',
                    'flex items-center justify-center',
                    'hover:rotate-90 hover:scale-110'
                  )}
                >
                  <X size={20} />
                </button>

                <div className="relative p-8">
                  {/* Quest Header */}
                  <div className="flex items-start gap-6 mb-8">
                    {/* Quest Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                      className={clsx(
                        'relative flex-shrink-0',
                        'w-32 h-32 rounded-2xl',
                        'bg-gradient-to-br from-dark-700 to-dark-900',
                        'border-2 border-gold-500/50',
                        'flex items-center justify-center',
                        'shadow-[0_0_30px_rgba(255,215,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.1)]'
                      )}
                    >
                      <span className="text-7xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                        {quest.icon}
                      </span>

                      {/* Corner decorations */}
                      <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-gold-500" />
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-gold-500" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-gold-500" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-gold-500" />
                    </motion.div>

                    {/* Quest Info */}
                    <div className="flex-1">
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className={clsx(
                          'text-4xl font-fantasy mb-3',
                          'bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400',
                          'bg-clip-text text-transparent',
                          'drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)]'
                        )}
                      >
                        {quest.title}
                      </motion.h2>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-3 mb-4"
                      >
                        <DifficultyBadge difficulty={quest.difficulty} />
                        <RiskIndicator risk={quest.risk} showLabel={true} />
                        <span className="px-3 py-1 rounded-full bg-dark-900/60 border border-purple-500/40 text-purple-400 text-xs font-semibold uppercase tracking-wider">
                          {quest.category}
                        </span>
                      </motion.div>

                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-300 leading-relaxed text-lg"
                      >
                        {quest.description}
                      </motion.p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent mb-8" />

                  {/* Quest Steps */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                  >
                    <h3 className="text-xl font-fantasy text-gold-500 mb-4 flex items-center gap-2">
                      <Zap size={20} className="text-gold-500" />
                      Quest Steps
                    </h3>
                    <div className="space-y-3">
                      {quest.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className={clsx(
                            'flex items-start gap-4 p-4',
                            'bg-dark-900/40 rounded-lg',
                            'border border-gold-500/20',
                            'hover:border-gold-500/40 hover:bg-dark-900/60',
                            'transition-all duration-300'
                          )}
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-gold-500 flex items-center justify-center text-xl shadow-lg">
                            {step.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-gold-500 uppercase tracking-wider">
                                Step {index + 1}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Configuration Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-6 p-6 bg-dark-900/60 rounded-xl border border-gold-500/30"
                  >
                    <h3 className="text-lg font-fantasy text-gold-500 mb-4 flex items-center gap-2">
                      <Info size={18} />
                      Quest Configuration
                    </h3>

                    <div className="space-y-4">
                      {/* Amount Input */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Amount (MSUI)
                        </label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount..."
                          className={clsx(
                            'w-full px-4 py-3 rounded-lg',
                            'bg-dark-800 border-2 border-gold-500/30',
                            'text-gray-100 placeholder-gray-500',
                            'focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20',
                            'transition-all duration-300'
                          )}
                        />
                      </div>

                      {/* Slippage Setting */}
                      {quest.id === 'swap' && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Slippage Tolerance: {slippage}%
                          </label>
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min="0.1"
                              max="5"
                              step="0.1"
                              value={slippage}
                              onChange={(e) => setSlippage(parseFloat(e.target.value))}
                              className="flex-1 h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
                            />
                            <span className="text-gold-500 font-semibold w-16 text-right">
                              {slippage}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            Higher slippage increases success rate but may result in worse prices
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Reward Display */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-gold-900/30 rounded-xl border border-gold-500/40"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles size={24} className="text-gold-500" />
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Estimated Reward</p>
                        <p className="text-2xl font-fantasy text-gold-500">
                          {quest.estimatedReward}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Start Quest Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    onClick={handleStartQuest}
                    disabled={!amount || parseFloat(amount) <= 0}
                    className={clsx(
                      'w-full py-4 rounded-xl font-fantasy text-lg',
                      'bg-gradient-to-r from-purple-600 via-gold-500 to-purple-600',
                      'bg-size-200 bg-pos-0',
                      'text-white font-bold uppercase tracking-wider',
                      'border-2 border-gold-500/50',
                      'shadow-[0_0_30px_rgba(255,215,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.2)]',
                      'hover:bg-pos-100 hover:shadow-[0_0_50px_rgba(255,215,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)]',
                      'hover:scale-105',
                      'active:scale-95',
                      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                      'transition-all duration-500',
                      'relative overflow-hidden'
                    )}
                    style={{
                      backgroundSize: '200% 100%',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Zap size={20} />
                      Start Quest
                    </span>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          <style jsx>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
            .bg-size-200 { background-size: 200% 100%; }
            .bg-pos-0 { background-position: 0% 50%; }
            .bg-pos-100 { background-position: 100% 50%; }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};
