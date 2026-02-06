"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Coins, ArrowRight, Info, Vault } from "lucide-react";
import { useYieldQuest } from "@/hooks/useYieldQuest";
import { estimateEarnings, formatAPY } from "@/lib/ptb/yield";

export interface YieldQuestProps {
  onClose: () => void;
  userMSUIBalance?: number;
}

// Mock APY - in production this would come from the contract
const CURRENT_APY = 5.0;

export const YieldQuest: React.FC<YieldQuestProps> = ({
  onClose,
  userMSUIBalance = 1000,
}) => {
  const [depositAmount, setDepositAmount] = useState<string>("");
  const { deposit, isProcessing } = useYieldQuest();

  const numericAmount = parseFloat(depositAmount) || 0;
  const dailyEarnings = estimateEarnings(numericAmount, CURRENT_APY, 1);
  const monthlyEarnings = estimateEarnings(numericAmount, CURRENT_APY, 30);
  const yearlyEarnings = estimateEarnings(numericAmount, CURRENT_APY, 365);

  const handleStartQuest = async () => {
    if (!depositAmount || numericAmount <= 0) {
      alert("Please enter a valid deposit amount");
      return;
    }

    if (numericAmount > userMSUIBalance) {
      alert("Insufficient MSUI balance");
      return;
    }

    // Mock coin ID - in production this would come from wallet
    const mockCoinId = `0x${Math.random().toString(16).slice(2)}`;

    const result = await deposit(mockCoinId, numericAmount);

    if (result.success) {
      // Success is handled by victory screen
      console.log("Deposit successful!", result);
    } else {
      // Error is handled by defeat screen
      console.error("Deposit failed:", result.error);
    }
  };

  const setMaxAmount = () => {
    setDepositAmount(userMSUIBalance.toString());
  };

  return (
    <motion.div
      className="relative max-w-2xl w-full mx-auto p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-dark-800 via-dark-800 to-dark-900 rounded-2xl border-2 border-gold-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 border-b border-gold-500/20 bg-gradient-to-r from-dark-800 to-dark-900">
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="flex items-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-gold-500 flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Vault className="w-8 h-8 text-white" />
            </motion.div>
            <div className="flex-grow">
              <h2 className="text-3xl font-fantasy text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                Yield Quest
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Deposit MSUI into the sacred vault and watch your wealth grow
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* APY Display */}
          <motion.div
            className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-gold-500/10 border border-gold-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold-500" />
                <span className="text-gray-300 font-medium">Current APY</span>
              </div>
              <div className="text-2xl font-bold text-gold-400">
                {formatAPY(CURRENT_APY)}
              </div>
            </div>
            <div className="mt-2 flex items-start gap-2 text-xs text-gray-400">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Annual Percentage Yield. Your deposit earns interest
                continuously.
              </span>
            </div>
          </motion.div>

          {/* Deposit Amount Input */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-semibold text-gray-300">
              Deposit Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 pr-20 bg-dark-900 border-2 border-gold-500/30 rounded-xl text-white text-lg focus:border-gold-500 focus:outline-none transition-colors"
                disabled={isProcessing}
                min="0"
                step="0.01"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-gray-400 font-semibold">MSUI</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Balance:{" "}
                <span className="text-gold-400 font-semibold">
                  {userMSUIBalance.toFixed(2)} MSUI
                </span>
              </span>
              <button
                onClick={setMaxAmount}
                className="px-3 py-1 rounded-lg bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-colors font-semibold"
                disabled={isProcessing}
              >
                MAX
              </button>
            </div>
          </motion.div>

          {/* Expected Earnings */}
          {numericAmount > 0 && (
            <motion.div
              className="space-y-3 p-4 rounded-xl bg-dark-900 border border-gold-500/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Coins className="w-5 h-5 text-gold-500" />
                <span className="text-gray-300 font-semibold">
                  Expected Earnings
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-dark-800 border border-gold-500/10">
                  <div className="text-xs text-gray-400 mb-1">Daily</div>
                  <div className="text-lg font-bold text-gold-400">
                    +{dailyEarnings.toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500">MSUI</div>
                </div>

                <div className="p-3 rounded-lg bg-dark-800 border border-gold-500/10">
                  <div className="text-xs text-gray-400 mb-1">Monthly</div>
                  <div className="text-lg font-bold text-gold-400">
                    +{monthlyEarnings.toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500">MSUI</div>
                </div>

                <div className="p-3 rounded-lg bg-dark-800 border border-gold-500/10">
                  <div className="text-xs text-gray-400 mb-1">Yearly</div>
                  <div className="text-lg font-bold text-gold-400">
                    +{yearlyEarnings.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">MSUI</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info Box */}
          <motion.div
            className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  <span className="font-semibold text-purple-400">
                    How it works:
                  </span>{" "}
                  Your MSUI tokens are deposited into the lending vault where
                  they earn continuous interest.
                </p>
                <p>
                  You&apos;ll receive a{" "}
                  <span className="text-gold-400 font-semibold">
                    Vault Receipt NFT
                  </span>{" "}
                  that represents your deposit and accrued earnings.
                </p>
                <p>
                  You can withdraw your deposit + earnings anytime by using your
                  receipt.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gold-500/20 bg-dark-900/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 font-semibold hover:bg-gray-800 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <motion.button
            onClick={handleStartQuest}
            disabled={
              isProcessing ||
              !depositAmount ||
              numericAmount <= 0 ||
              numericAmount > userMSUIBalance
            }
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-gold-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Processing...
              </>
            ) : (
              <>
                Start Quest
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-2 -left-2 w-20 h-20 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
    </motion.div>
  );
};
