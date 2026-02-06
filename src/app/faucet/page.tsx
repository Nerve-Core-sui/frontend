'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Check, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth';

export default function FaucetPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const tokens = [
    { symbol: 'SUI', name: 'Sui Token', amount: '10', icon: '💧' },
    { symbol: 'USDC', name: 'USD Coin', amount: '100', icon: '💵' },
    { symbol: 'WETH', name: 'Wrapped ETH', amount: '0.01', icon: '⟠' },
  ];

  const handleClaim = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    setClaimed(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setClaimed(false);
      setCooldown(true);
    }, 3000);
  };

  return (
    <AuthGuard>
      <div className="py-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Token Faucet
          </h1>
          <p className="text-sm text-text-secondary">
            Get free testnet tokens
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 text-center">
            {/* Icon */}
            <motion.div
              className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                claimed ? 'bg-success/20' : 'bg-accent/20'
              }`}
              animate={claimed ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {claimed ? (
                <Check size={40} className="text-success" />
              ) : (
                <Droplets size={40} className="text-accent" />
              )}
            </motion.div>

            {/* Status */}
            {claimed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-bold text-text-primary mb-2">
                  Tokens Claimed!
                </h2>
                <p className="text-sm text-text-secondary mb-4">
                  Tokens have been sent to your wallet
                </p>
              </motion.div>
            ) : cooldown ? (
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-2">
                  Come Back Later
                </h2>
                <p className="text-sm text-text-secondary mb-4">
                  You can claim again in 24 hours
                </p>
                <div className="flex items-center justify-center gap-2 text-warning">
                  <Clock size={16} />
                  <span className="text-sm font-medium">23:59:59 remaining</span>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-2">
                  Claim Free Tokens
                </h2>
                <p className="text-sm text-text-secondary mb-6">
                  Get testnet tokens to try out NerveCore
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  loading={isLoading}
                  onClick={handleClaim}
                >
                  {isLoading ? 'Claiming...' : 'Claim Tokens'}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Token List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="section-header px-1">Available Tokens</h3>
          <Card className="p-0 overflow-hidden">
            {tokens.map((token, index) => (
              <div
                key={token.symbol}
                className={`flex items-center gap-3 p-4 ${
                  index !== tokens.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="w-10 h-10 bg-surface-elevated rounded-full flex items-center justify-center text-xl">
                  {token.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary">{token.symbol}</p>
                  <p className="text-xs text-text-muted">{token.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-accent">
                    +{token.amount}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-accent/5 border-accent/20">
            <p className="text-xs text-text-secondary">
              <strong className="text-accent">Note:</strong> These are testnet tokens with no real value.
              They are for testing purposes only. You can claim once every 24 hours.
            </p>
          </Card>
        </motion.div>
      </div>
    </AuthGuard>
  );
}
