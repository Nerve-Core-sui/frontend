'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Check, Clock, AlertCircle, Coins, ExternalLink, Copy } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useExecuteTransaction } from '@/hooks/useExecuteTransaction';
import { createFaucetMSUITransaction, createFaucetMUSDCTransaction } from '@/lib/contracts';

type ClaimStatus = 'idle' | 'claiming' | 'success' | 'cooldown' | 'error';

interface TokenFaucet {
  symbol: string;
  name: string;
  amount: string;
  icon: string;
  status: ClaimStatus;
  error?: string;
  txDigest?: string;
}

const SUI_FAUCET_URL = 'https://faucet.sui.io/';

export default function FaucetPage() {
  const { user, refreshBalance } = useAuth();
  const { execute, isExecuting, hasProof } = useExecuteTransaction();
  const [tokens, setTokens] = useState<TokenFaucet[]>([
    { symbol: 'MSUI', name: 'Mock SUI', amount: '1,000', icon: '💧', status: 'idle' },
    { symbol: 'MUSDC', name: 'Mock USDC', amount: '1,000', icon: '💵', status: 'idle' },
  ]);
  const [copied, setCopied] = useState(false);

  const updateToken = (index: number, updates: Partial<TokenFaucet>) => {
    setTokens(prev => prev.map((t, i) => i === index ? { ...t, ...updates } : t));
  };

  // Copy address and open Sui faucet website
  const handleGetSUI = () => {
    if (!user?.address) return;

    // Copy address to clipboard
    navigator.clipboard.writeText(user.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    // Open faucet in new tab
    window.open(SUI_FAUCET_URL + "?address=" + user.address, '_blank', 'noopener,noreferrer');

    // Refresh balance after a delay (user will come back after getting SUI)
    setTimeout(() => refreshBalance(), 10000);
  };

  const handleClaim = async (index: number) => {
    const token = tokens[index];
    if (token.status === 'claiming' || isExecuting) return;

    updateToken(index, { status: 'claiming', error: undefined });

    try {
      const tx = token.symbol === 'MSUI'
        ? createFaucetMSUITransaction()
        : createFaucetMUSDCTransaction();

      const result = await execute(tx);

      updateToken(index, {
        status: 'success',
        txDigest: result.digest,
      });

      setTimeout(() => {
        updateToken(index, { status: 'idle', txDigest: undefined });
      }, 5000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Claim failed';

      if (message.includes('MoveAbort') && message.includes('1')) {
        updateToken(index, { status: 'cooldown', error: 'Cooldown active (1 hour between claims)' });
        setTimeout(() => updateToken(index, { status: 'idle', error: undefined }), 5000);
      } else if (message.includes('gas') || message.includes('Gas') || message.includes('coin')) {
        updateToken(index, { status: 'error', error: 'Not enough SUI for gas. Get SUI first (Step 1)!' });
        setTimeout(() => updateToken(index, { status: 'idle', error: undefined }), 5000);
      } else {
        updateToken(index, { status: 'error', error: message });
        setTimeout(() => updateToken(index, { status: 'idle', error: undefined }), 5000);
      }
    }
  };

  const handleClaimAll = async () => {
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].status !== 'claiming' && tokens[i].status !== 'cooldown') {
        await handleClaim(i);
      }
    }
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
            Get free testnet tokens to try NerveCore
          </p>
        </motion.div>

        {/* No Proof Warning */}
        {!hasProof && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 bg-warning/5 border-warning/20">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-warning">ZK Proof Required</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Transaction signing requires a ZK proof. Please log out and log back in.
                    The prover service may have been down during your last login.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 1: Get SUI for Gas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h3 className="section-header px-1">Step 1: Get SUI for Gas Fees</h3>
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Coins size={24} className="text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">Native SUI Tokens</p>
                <p className="text-xs text-text-muted">
                  Get SUI from the official faucet for gas fees
                </p>
              </div>
            </div>

            {/* Address display with copy */}
            {user?.address && (
              <div className="bg-surface-elevated rounded-lg p-3">
                <p className="text-xs text-text-muted mb-1.5">Your wallet address:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-text-primary font-mono truncate">
                    {user.address}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.address);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-1.5 text-text-muted hover:text-accent rounded transition-colors flex-shrink-0"
                  >
                    {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}

            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={handleGetSUI}
              icon={<ExternalLink size={14} />}
            >
              {copied ? 'Address Copied! Opening Faucet...' : 'Copy Address & Open SUI Faucet'}
            </Button>

            <p className="text-xs text-text-muted text-center">
              Paste your address on the faucet page, then come back here
            </p>

            {user?.balance !== undefined && (
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <p className="text-xs text-text-muted">
                  Current SUI balance: <span className="text-text-primary font-semibold">{user.balance.toFixed(4)} SUI</span>
                </p>
                <button
                  onClick={() => refreshBalance()}
                  className="text-xs text-accent hover:underline"
                >
                  Refresh
                </button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Step 2: Claim Test Tokens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="section-header px-1">Step 2: Claim Test Tokens</h3>
          <Card className="p-6 text-center">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-accent/20"
            >
              <Droplets size={40} className="text-accent" />
            </motion.div>

            <h2 className="text-xl font-bold text-text-primary mb-2">
              Claim Free Tokens
            </h2>
            <p className="text-sm text-text-secondary mb-6">
              Get 1,000 MSUI + 1,000 MUSDC for testing
            </p>
            <Button
              variant="primary"
              size="lg"
              loading={isExecuting}
              disabled={!hasProof || (user?.balance ?? 0) < 0.01}
              onClick={handleClaimAll}
            >
              {isExecuting ? 'Claiming...' : 'Claim All Tokens'}
            </Button>
            {(user?.balance ?? 0) < 0.01 && hasProof && (
              <p className="text-xs text-warning mt-3">
                Get SUI first (Step 1) to pay for gas fees
              </p>
            )}
          </Card>
        </motion.div>

        {/* Token List with Individual Claim */}
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
                  {token.status === 'error' && (
                    <p className="text-xs text-error mt-1">{token.error}</p>
                  )}
                  {token.status === 'cooldown' && (
                    <p className="text-xs text-warning mt-1 flex items-center gap-1">
                      <Clock size={12} /> {token.error}
                    </p>
                  )}
                  {token.status === 'success' && token.txDigest && (
                    <a
                      href={`https://suiscan.xyz/testnet/tx/${token.txDigest}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent mt-1 underline"
                    >
                      View TX
                    </a>
                  )}
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-sm font-semibold text-accent">
                    +{token.amount}
                  </span>
                  {token.status === 'success' ? (
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                      <Check size={16} className="text-success" />
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={token.status === 'claiming'}
                      disabled={!hasProof || token.status === 'cooldown' || (user?.balance ?? 0) < 0.01}
                      onClick={() => handleClaim(index)}
                    >
                      Claim
                    </Button>
                  )}
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
              <strong className="text-accent">How it works:</strong> First get SUI for gas fees from the official faucet (Step 1),
              then claim MSUI/MUSDC test tokens (Step 2). Cooldown is 1 hour between claims.
              All tokens are minted on-chain via smart contract.
            </p>
          </Card>
        </motion.div>
      </div>
    </AuthGuard>
  );
}
