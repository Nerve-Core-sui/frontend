"use client";

import React, { useState, useMemo, useCallback } from "react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  AlertTriangle,
  TrendingUp,
  Shield,
  Coins,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLeverageQuest } from "@/hooks/useLeverageQuest";
import { LEVERAGE_STEPS } from "@/lib/ptb/leverage";

export interface LeverageQuestProps {
  onClose?: () => void;
  onSuccess?: (txDigest: string) => void;
}

export const LeverageQuest: React.FC<LeverageQuestProps> = ({
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [showRiskWarning, setShowRiskWarning] = useState(true);

  const {
    isExecuting,
    currentStepIndex,
    error,
    txDigest,
    battleState,
    executeLeverage,
    getLeverageInfo,
    reset,
  } = useLeverageQuest({
    onSuccess: (digest) => {
      onSuccess?.(digest);
    },
  });

  const leverageInfo = useMemo(
    () => getLeverageInfo(amount),
    [amount, getLeverageInfo],
  );

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.]/g, "");
      // Prevent multiple decimals
      const parts = value.split(".");
      if (parts.length > 2) return;
      if (parts[1] && parts[1].length > 4) return;
      setAmount(value);
    },
    [],
  );

  const handleExecute = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    await executeLeverage(amount);
  }, [amount, executeLeverage]);

  const handleClose = useCallback(() => {
    reset();
    onClose?.();
  }, [reset, onClose]);

  const isValidAmount = useMemo(() => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  }, [amount]);

  // Render victory state
  if (battleState.status === "victory") {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl mb-4"
          >
            🏆
          </motion.div>
          <h3 className="text-2xl font-fantasy text-gold-500 mb-2">
            Leverage Quest Complete!
          </h3>
          <p className="text-gray-300 mb-4">
            4 DeFi operations executed in 1 atomic transaction!
          </p>

          {/* Position Summary */}
          <div className="bg-dark-800/80 rounded-xl p-6 border border-gold-500/30 mb-6">
            <h4 className="text-lg font-semibold text-gold-400 mb-4">
              Position Summary
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <span className="text-gray-400">Initial Deposit</span>
                <p className="text-white font-mono">
                  {leverageInfo.initialDisplay} MSUI
                </p>
              </div>
              <div className="text-left">
                <span className="text-gray-400">Borrowed</span>
                <p className="text-amber-400 font-mono">
                  {leverageInfo.borrowDisplay} MUSDC
                </p>
              </div>
              <div className="text-left">
                <span className="text-gray-400">Final Exposure</span>
                <p className="text-emerald-400 font-mono">
                  {leverageInfo.finalDisplay} MSUI
                </p>
              </div>
              <div className="text-left">
                <span className="text-gray-400">Leverage</span>
                <p className="text-purple-400 font-mono text-lg">
                  {leverageInfo.multiplier}
                </p>
              </div>
            </div>
          </div>

          {txDigest && (
            <p className="text-xs text-gray-500 font-mono break-all">
              TX: {txDigest.slice(0, 20)}...{txDigest.slice(-8)}
            </p>
          )}
        </motion.div>

        <Button variant="primary" className="w-full" onClick={handleClose}>
          Close Quest
        </Button>
      </div>
    );
  }

  // Render defeat state
  if (battleState.status === "defeat") {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8"
        >
          <motion.div className="text-6xl mb-4">💔</motion.div>
          <h3 className="text-2xl font-fantasy text-red-500 mb-2">
            Transaction Reverted
          </h3>
          <p className="text-gray-300 mb-4">
            {battleState.errorMessage || "An error occurred"}
          </p>

          {/* Safety message */}
          <div className="bg-emerald-950/30 rounded-xl p-4 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400">
              <Shield size={20} />
              <span className="font-semibold">Your funds are safe!</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Thanks to Sui&apos;s atomic PTB, if ANY step fails, the entire
              transaction reverts. No partial execution means no stuck funds.
            </p>
          </div>
        </motion.div>

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" className="flex-1" onClick={reset}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Render executing state
  if (isExecuting) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-fantasy text-gold-500 mb-2">
            Executing Leverage Quest
          </h3>
          <p className="text-gray-400 text-sm">
            4 DeFi operations in 1 atomic transaction
          </p>
        </div>

        {/* Step Progress */}
        <div className="space-y-3">
          {LEVERAGE_STEPS.map((step, index) => {
            const isCompleted =
              index < currentStepIndex ||
              battleState.steps[index]?.status === "completed";
            const isActive = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={clsx(
                  "flex items-center gap-4 p-4 rounded-lg border transition-all",
                  isCompleted && "bg-emerald-950/30 border-emerald-500/50",
                  isActive &&
                    "bg-amber-950/30 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
                  isPending && "bg-dark-800/50 border-dark-600/50 opacity-50",
                )}
              >
                {/* Step Icon */}
                <div
                  className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center text-xl",
                    isCompleted && "bg-emerald-500/20",
                    isActive && "bg-amber-500/20",
                    isPending && "bg-dark-700",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="text-emerald-400" size={24} />
                  ) : isActive ? (
                    <Loader2
                      className="text-amber-400 animate-spin"
                      size={24}
                    />
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1">
                  <h4
                    className={clsx(
                      "font-semibold",
                      isCompleted && "text-emerald-400",
                      isActive && "text-amber-400",
                      isPending && "text-gray-500",
                    )}
                  >
                    Step {index + 1}: {step.name}
                  </h4>
                  <p
                    className={clsx(
                      "text-sm",
                      isActive ? "text-gray-300" : "text-gray-500",
                    )}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Attack indicator for active step */}
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="text-amber-400"
                  >
                    <Zap size={20} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-gold-500 to-emerald-500"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentStepIndex + 1) / LEVERAGE_STEPS.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    );
  }

  // Render input state (default)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-400 text-xs mb-4">
          <Zap size={14} />
          <span>FLAGSHIP FEATURE</span>
        </div>
        <h3 className="text-xl font-fantasy text-gold-500 mb-2">
          Multi-Step PTB Power
        </h3>
        <p className="text-gray-400 text-sm">
          4 DeFi operations in 1 atomic transaction!
        </p>
      </div>

      {/* Risk Warning */}
      <AnimatePresence>
        {showRiskWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-950/30 rounded-xl p-4 border border-amber-500/30"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="text-amber-400 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div className="flex-1">
                <h4 className="text-amber-400 font-semibold mb-1">
                  Advanced Strategy
                </h4>
                <p className="text-sm text-gray-300">
                  Leverage amplifies both gains AND losses. Monitor your health
                  factor to avoid liquidation. This quest uses mock tokens.
                </p>
              </div>
              <button
                onClick={() => setShowRiskWarning(false)}
                className="text-gray-500 hover:text-gray-300"
              >
                <XCircle size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Amount Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          Initial MSUI Amount
        </label>
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount..."
            className={clsx(
              "w-full px-4 py-3 pr-20 rounded-lg",
              "bg-dark-800 border-2 border-dark-600",
              "text-white placeholder-gray-500",
              "focus:outline-none focus:border-gold-500/50",
              "transition-colors",
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="text-gold-500 font-semibold">MSUI</span>
          </div>
        </div>
      </div>

      {/* Leverage Preview */}
      {isValidAmount && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800/80 rounded-xl p-4 border border-gold-500/20"
        >
          <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <TrendingUp size={16} />
            Position Preview
          </h4>

          <div className="space-y-3">
            {/* Visual flow */}
            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <p className="text-gray-400 text-xs">Initial</p>
                <p className="text-white font-mono">
                  {leverageInfo.initialDisplay}
                </p>
                <p className="text-gray-500 text-xs">MSUI</p>
              </div>
              <ArrowRight className="text-gold-500" size={20} />
              <div className="text-center">
                <p className="text-gray-400 text-xs">Borrow</p>
                <p className="text-amber-400 font-mono">
                  {leverageInfo.borrowDisplay}
                </p>
                <p className="text-gray-500 text-xs">MUSDC</p>
              </div>
              <ArrowRight className="text-gold-500" size={20} />
              <div className="text-center">
                <p className="text-gray-400 text-xs">Final</p>
                <p className="text-emerald-400 font-mono font-bold">
                  {leverageInfo.finalDisplay}
                </p>
                <p className="text-gray-500 text-xs">MSUI</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dark-600">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-purple-500/20">
                  <TrendingUp size={14} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Leverage</p>
                  <p className="text-purple-400 font-semibold">
                    {leverageInfo.multiplier}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-emerald-500/20">
                  <Shield size={14} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Health Factor</p>
                  <p className="text-emerald-400 font-semibold">
                    {leverageInfo.healthFactor}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step Breakdown */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
          <Info size={14} />
          Transaction Steps (All Atomic)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {LEVERAGE_STEPS.map((step) => (
            <div
              key={step.id}
              className="flex items-center gap-2 p-2 rounded bg-dark-800/50 border border-dark-600/50"
            >
              <span className="text-lg">{step.icon}</span>
              <span className="text-xs text-gray-400">{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PTB Highlight */}
      <div className="bg-gradient-to-r from-purple-950/30 via-dark-800/50 to-purple-950/30 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Coins className="text-purple-400" size={24} />
          </div>
          <div>
            <h4 className="text-purple-400 font-semibold">Sui PTB Magic</h4>
            <p className="text-xs text-gray-400">
              If ANY step fails, the ENTIRE transaction reverts atomically. Your
              funds are always safe!
            </p>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Execute Button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!isValidAmount || isExecuting}
        onClick={handleExecute}
      >
        {isExecuting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            Executing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Zap size={20} />
            Start Leverage Quest
          </span>
        )}
      </Button>
    </div>
  );
};

export default LeverageQuest;
