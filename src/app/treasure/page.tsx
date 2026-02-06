'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TreasureChest } from '@/components/treasure';
import { AuthGuard } from '@/components/auth';

export default function TreasurePage() {
  const [lastClaimTime, setLastClaimTime] = useState<number | null>(null);
  const COOLDOWN_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  const handleClaim = async () => {
    // Mock faucet claim - in production this would call the smart contract
    console.log('Claiming tokens from faucet...');
    setLastClaimTime(Date.now());
    // Here you would execute the faucet transaction
  };

  const isOnCooldown = lastClaimTime
    ? Date.now() - lastClaimTime < COOLDOWN_DURATION
    : false;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-900/20 to-slate-900 relative overflow-hidden">
        {/* Mystical background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              Treasure Vault
            </h1>
            <p className="text-xl text-amber-300">
              Open the mystical chest to receive your treasure tokens
            </p>
          </motion.div>

          <div className="flex justify-center items-center min-h-[500px]">
            <TreasureChest
              onClaim={handleClaim}
              isOnCooldown={isOnCooldown}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 text-slate-400 max-w-2xl mx-auto"
          >
            <p className="mb-2">
              The treasure chest contains MSUI and MUSDC tokens for testing.
            </p>
            <p className="text-sm">
              Use these tokens to embark on quests and explore DeFi strategies.
            </p>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}
