'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDownUp, Info, TrendingUp, AlertCircle } from 'lucide-react';
import { useSwapQuest } from '@/hooks/useSwapQuest';
import { SwapDirection } from '@/lib/ptb/swap';
import { formatSwapAmount } from '@/lib/ptb/swap';

interface SwapQuestProps {
  isOpen: boolean;
  onClose: () => void;
}

const SLIPPAGE_OPTIONS = [0.5, 1, 2];

export const SwapQuest: React.FC<SwapQuestProps> = ({ isOpen, onClose }) => {
  const {
    getQuote,
    quote,
    isLoadingQuote,
    executeSwap,
    isExecuting,
    error,
    txDigest,
    txSuccess,
  } = useSwapQuest();

  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [direction, setDirection] = useState<SwapDirection>('msui_to_musdc');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get quote when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const timer = setTimeout(() => {
        getQuote(amount, direction, slippage);
      }, 500); // Debounce

      return () => clearTimeout(timer);
    }
  }, [amount, direction, slippage, getQuote]);

  const handleSwapDirection = () => {
    setDirection((prev) =>
      prev === 'msui_to_musdc' ? 'musdc_to_msui' : 'msui_to_musdc'
    );
  };

  const handleStartQuest = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }
    await executeSwap(amount, slippage, direction);
  };

  const handleClose = () => {
    setAmount('');
    setSlippage(1);
    setDirection('msui_to_musdc');
    setShowAdvanced(false);
    onClose();
  };

  const inputToken = direction === 'msui_to_musdc' ? 'MSUI' : 'MUSDC';
  const outputToken = direction === 'msui_to_musdc' ? 'MUSDC' : 'MSUI';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-lg pointer-events-auto">
              {/* Modal Content */}
              <div className="relative bg-gradient-to-br from-dark-800 via-dark-800 to-dark-900 border-2 border-gold-500/30 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NGgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEY0djRIMHY2aDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

                {/* Header */}
                <div className="relative border-b border-gold-500/20 p-6 bg-gradient-to-r from-dark-800 to-dark-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center border border-gold-500/30">
                        <span className="text-3xl">🔄</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-fantasy bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                          Token Swap Quest
                        </h2>
                        <p className="text-sm text-gray-400">Exchange tokens at market rates</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-10 h-10 rounded-lg bg-dark-700 hover:bg-dark-600 border border-gold-500/30 flex items-center justify-center transition-colors"
                    >
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="relative p-6 space-y-4">
                  {/* Input Token */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">You Pay</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-dark-700 border border-gold-500/30 rounded-xl px-4 py-4 text-2xl font-bold text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/60 transition-colors"
                        disabled={isExecuting}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-2 bg-dark-800 rounded-lg border border-gold-500/30">
                        <span className="text-sm font-bold text-gold-400">{inputToken}</span>
                      </div>
                    </div>
                  </div>

                  {/* Swap Direction Button */}
                  <div className="flex justify-center -my-2 relative z-10">
                    <button
                      onClick={handleSwapDirection}
                      disabled={isExecuting}
                      className="w-12 h-12 rounded-xl bg-dark-700 hover:bg-dark-600 border-2 border-gold-500/30 hover:border-gold-500/60 flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowDownUp size={20} className="text-gold-400" />
                    </button>
                  </div>

                  {/* Output Token */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">You Receive</label>
                    <div className="relative">
                      <div className="w-full bg-dark-700/50 border border-gold-500/20 rounded-xl px-4 py-4 text-2xl font-bold text-gray-300">
                        {isLoadingQuote ? (
                          <span className="text-gray-500">Calculating...</span>
                        ) : quote ? (
                          formatSwapAmount(quote.expectedOutput)
                        ) : (
                          <span className="text-gray-600">0.00</span>
                        )}
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-2 bg-dark-800 rounded-lg border border-gold-500/30">
                        <span className="text-sm font-bold text-gold-400">{outputToken}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quote Details */}
                  {quote && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-dark-700/50 border border-gold-500/20 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Exchange Rate</span>
                        <span className="text-white font-semibold">
                          1 {inputToken} = {quote.exchangeRate.toFixed(4)} {outputToken}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Minimum Received</span>
                        <span className="text-white font-semibold">
                          {formatSwapAmount(quote.minOutput)} {outputToken}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Price Impact</span>
                        <span
                          className={`font-semibold ${
                            quote.priceImpact > 5
                              ? 'text-red-400'
                              : quote.priceImpact > 2
                              ? 'text-yellow-400'
                              : 'text-green-400'
                          }`}
                        >
                          {quote.priceImpact.toFixed(2)}%
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Slippage Settings */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                        Slippage Tolerance
                        <Info size={14} className="text-gray-500" />
                      </label>
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-xs text-gold-400 hover:text-gold-300 transition-colors"
                      >
                        {showAdvanced ? 'Hide' : 'Show'} Settings
                      </button>
                    </div>

                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-2">
                            {SLIPPAGE_OPTIONS.map((option) => (
                              <button
                                key={option}
                                onClick={() => setSlippage(option)}
                                disabled={isExecuting}
                                className={`flex-1 py-2 rounded-lg border-2 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                  slippage === option
                                    ? 'bg-gold-500/20 border-gold-500 text-gold-400'
                                    : 'bg-dark-700 border-gold-500/30 text-gray-400 hover:border-gold-500/60'
                                }`}
                              >
                                {option}%
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
                    >
                      <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-400">Transaction Failed</p>
                        <p className="text-xs text-red-300/80 mt-1">{error}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Success Message */}
                  {txSuccess && txDigest && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3"
                    >
                      <TrendingUp size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-400">Swap Successful!</p>
                        <p className="text-xs text-green-300/80 mt-1">
                          Transaction: {txDigest.slice(0, 8)}...{txDigest.slice(-6)}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Start Quest Button */}
                  <button
                    onClick={handleStartQuest}
                    disabled={!amount || parseFloat(amount) <= 0 || isExecuting || isLoadingQuote}
                    className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-dark-900 shadow-[0_4px_20px_rgba(255,215,0,0.3)] hover:shadow-[0_6px_30px_rgba(255,215,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isExecuting ? 'Swapping...' : 'Start Quest'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
