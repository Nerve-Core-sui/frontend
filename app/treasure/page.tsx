'use client';

import React, { useState, useCallback } from 'react';
import { PageTransition } from '@/components/motion';
import { TreasureChest } from '@/components/treasure/TreasureChest';
import { CoinBurst } from '@/components/treasure/CoinParticle';
import { TokenReward } from '@/components/treasure/TokenReward';
import { CooldownTimer } from '@/components/treasure/CooldownTimer';
import { useAuth } from '@/contexts/AuthContext';
import { createFaucetMSUITransaction, createFaucetMUSDCTransaction } from '@/lib/contracts';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ClaimStatus = 'idle' | 'claiming' | 'success' | 'error';

// Mock rewards - adjust based on actual faucet amounts
const MSUI_REWARD = 100;
const MUSDC_REWARD = 1000;
const COOLDOWN_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export default function TreasurePage() {
  const { isAuthenticated, session } = useAuth();
  const router = useRouter();

  const [claimStatus, setClaimStatus] = useState<ClaimStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showReward, setShowReward] = useState(false);
  const [showCoinBurst, setShowCoinBurst] = useState(false);
  const [cooldownEndTime, setCooldownEndTime] = useState<number | null>(null);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  // Check cooldown status from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined' && session?.address) {
      const key = `faucet_cooldown_${session.address}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const endTime = parseInt(stored, 10);
        if (endTime > Date.now()) {
          setCooldownEndTime(endTime);
          setIsOnCooldown(true);
        } else {
          localStorage.removeItem(key);
        }
      }
    }
  }, [session?.address]);

  const handleClaim = useCallback(async () => {
    if (!isAuthenticated || !session) {
      setErrorMessage('Please connect your wallet first');
      setClaimStatus('error');
      return;
    }

    setClaimStatus('claiming');
    setErrorMessage('');

    try {
      // In production, execute both faucet transactions
      // For now, simulate the transaction
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate transaction execution
      // const msuiTx = createFaucetMSUITransaction();
      // const musdcTx = createFaucetMUSDCTransaction();
      // await executeTransaction(msuiTx);
      // await executeTransaction(musdcTx);

      // Set cooldown
      const endTime = Date.now() + COOLDOWN_DURATION;
      if (typeof window !== 'undefined') {
        localStorage.setItem(`faucet_cooldown_${session.address}`, endTime.toString());
      }
      setCooldownEndTime(endTime);
      setIsOnCooldown(true);

      // Show animations
      setShowCoinBurst(true);
      setTimeout(() => setShowReward(true), 800);

      setClaimStatus('success');

      // Redirect to quests after 4 seconds
      setTimeout(() => {
        router.push('/quests');
      }, 4000);

    } catch (error) {
      console.error('Faucet claim failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to claim tokens');
      setClaimStatus('error');
    }
  }, [isAuthenticated, session, router]);

  const handleCooldownEnd = useCallback(() => {
    setIsOnCooldown(false);
    setCooldownEndTime(null);
    if (typeof window !== 'undefined' && session?.address) {
      localStorage.removeItem(`faucet_cooldown_${session.address}`);
    }
  }, [session?.address]);

  return (
    <PageTransition>
      {/* Dungeon Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-stone-950" />

        {/* Noise texture */}
        <div className="absolute inset-0 noise-overlay opacity-40" />

        {/* Ambient light rays */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-10"
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-amber-400 via-amber-600/30 to-transparent blur-3xl" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80" />
      </div>

      <div className="relative min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-4"
          >
            <Sparkles size={56} className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
          </motion.div>

          <h1 className="text-6xl font-fantasy text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 mb-4 tracking-wide">
            The Treasure Vault
          </h1>

          <p className="text-xl text-stone-400 max-w-2xl mx-auto font-light tracking-wide">
            Deep within the ancient dungeon lies a mystical chest, blessed by the gods of DeFi.
            <br />
            <span className="text-amber-400/80">Claim your fortune, brave adventurer.</span>
          </p>
        </motion.div>

        {/* Main Content Area */}
        <div className="w-full max-w-4xl relative">
          {/* Cooldown Timer */}
          {isOnCooldown && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 flex justify-center"
            >
              <CooldownTimer
                cooldownEndTime={cooldownEndTime}
                onCooldownEnd={handleCooldownEnd}
              />
            </motion.div>
          )}

          {/* Treasure Chest Container */}
          <div className="relative">
            {/* Glow effect container */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="w-96 h-96 rounded-full bg-amber-500/10 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Treasure Chest */}
            <TreasureChest
              onClaim={handleClaim}
              isOnCooldown={isOnCooldown}
              disabled={!isAuthenticated}
            />

            {/* Coin Burst Animation */}
            <CoinBurst count={20} isActive={showCoinBurst} />

            {/* Token Reward Display */}
            <AnimatePresence>
              {showReward && (
                <TokenReward
                  msuiAmount={MSUI_REWARD}
                  musdcAmount={MUSDC_REWARD}
                  isVisible={showReward}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {claimStatus === 'error' && errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 mx-auto max-w-md"
              >
                <div className="bg-red-950/40 border-2 border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
                    <div>
                      <p className="text-red-300 font-semibold mb-1">Claim Failed</p>
                      <p className="text-red-200/80 text-sm">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success - Redirect Notice */}
          <AnimatePresence>
            {claimStatus === 'success' && !showReward && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 text-center"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-950/40 to-emerald-900/40 border-2 border-emerald-500/50 rounded-full backdrop-blur-sm">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="text-emerald-400" size={20} />
                  </motion.div>
                  <span className="text-emerald-300 font-semibold">
                    Redirecting to quests...
                  </span>
                  <ChevronRight className="text-emerald-400" size={20} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-8 text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span>Once per 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>Wallet connection required</span>
            </div>
          </div>

          <p className="text-xs text-stone-600 italic">
            "Fortune favors the bold, but wisdom guides the hand."
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
