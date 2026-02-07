'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth';
import { suiClient } from '@/lib/sui-client';
import { PACKAGE_ID, formatTokenAmount } from '@/lib/contracts';
import { MIST_PER_SUI } from '@mysten/sui/utils';

interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  balanceFormatted: string;
  coinType: string;
  icon: string;
}

export default function WalletPage() {
  const { user, refreshBalance } = useAuth();
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchTokenBalances = useCallback(async () => {
    if (!user?.address) return;

    setIsLoading(true);
    try {
      // Fetch SUI balance
      const suiBalance = await suiClient.getBalance({
        owner: user.address,
        coinType: '0x2::sui::SUI',
      });

      const balances: TokenBalance[] = [
        {
          symbol: 'SUI',
          name: 'Sui',
          balance: suiBalance.totalBalance,
          balanceFormatted: (Number(suiBalance.totalBalance) / Number(MIST_PER_SUI)).toFixed(4),
          coinType: '0x2::sui::SUI',
          icon: 'SU',
        },
      ];

      // Fetch MSUI balance
      if (PACKAGE_ID) {
        try {
          const msuiBalance = await suiClient.getBalance({
            owner: user.address,
            coinType: `${PACKAGE_ID}::msui::MSUI`,
          });
          balances.push({
            symbol: 'MSUI',
            name: 'Mock SUI',
            balance: msuiBalance.totalBalance,
            balanceFormatted: formatTokenAmount(msuiBalance.totalBalance),
            coinType: `${PACKAGE_ID}::msui::MSUI`,
            icon: 'MS',
          });
        } catch {
          // Token not found for this address - that's ok
          balances.push({
            symbol: 'MSUI',
            name: 'Mock SUI',
            balance: '0',
            balanceFormatted: '0.00',
            coinType: `${PACKAGE_ID}::msui::MSUI`,
            icon: 'MS',
          });
        }

        // Fetch MUSDC balance
        try {
          const musdcBalance = await suiClient.getBalance({
            owner: user.address,
            coinType: `${PACKAGE_ID}::musdc::MUSDC`,
          });
          balances.push({
            symbol: 'MUSDC',
            name: 'Mock USDC',
            balance: musdcBalance.totalBalance,
            balanceFormatted: formatTokenAmount(musdcBalance.totalBalance),
            coinType: `${PACKAGE_ID}::musdc::MUSDC`,
            icon: 'MU',
          });
        } catch {
          balances.push({
            symbol: 'MUSDC',
            name: 'Mock USDC',
            balance: '0',
            balanceFormatted: '0.00',
            coinType: `${PACKAGE_ID}::musdc::MUSDC`,
            icon: 'MU',
          });
        }
      }

      setTokens(balances);
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.address]);

  useEffect(() => {
    fetchTokenBalances();
  }, [fetchTokenBalances]);

  const handleRefresh = async () => {
    await Promise.all([fetchTokenBalances(), refreshBalance()]);
  };

  const copyAddress = () => {
    if (user?.address) {
      navigator.clipboard.writeText(user.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate total value (mock prices)
  const totalValue = tokens.reduce((sum, t) => {
    const bal = parseFloat(t.balanceFormatted.replace(/,/g, '')) || 0;
    if (t.symbol === 'SUI') return sum + bal * 0.5;
    if (t.symbol === 'MSUI') return sum + bal * 0.5;
    if (t.symbol === 'MUSDC') return sum + bal * 1.0;
    return sum;
  }, 0);

  return (
    <AuthGuard>
      <div className="py-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              Wallet
            </h1>
            <p className="text-sm text-text-secondary">
              Manage your assets
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            icon={<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />}
          >
            Refresh
          </Button>
        </motion.div>

        {/* Address Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4">
            <p className="text-xs text-text-muted mb-2">Wallet Address</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm text-text-primary font-mono truncate">
                {user?.address || '---'}
              </code>
              <button
                onClick={copyAddress}
                className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-elevated transition-colors"
                title={copied ? 'Copied!' : 'Copy address'}
              >
                {copied ? (
                  <span className="text-xs text-success font-medium">Copied</span>
                ) : (
                  <Copy size={16} />
                )}
              </button>
              <a
                href={`https://suiscan.xyz/testnet/account/${user?.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-elevated transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </Card>
        </motion.div>

        {/* Total Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="p-4 text-center">
            <p className="text-xs text-text-muted mb-1">Estimated Total Value</p>
            <p className="text-3xl font-bold text-text-primary">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-text-muted mt-1">Mock prices for demo</p>
          </Card>
        </motion.div>

        {/* Token List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="section-header px-1">Tokens</h3>
          <Card className="p-0 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <RefreshCw size={24} className="animate-spin mx-auto text-text-muted mb-2" />
                <p className="text-sm text-text-muted">Loading balances...</p>
              </div>
            ) : tokens.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-text-muted">No tokens found</p>
              </div>
            ) : (
              tokens.map((token, index) => (
                <div
                  key={token.symbol}
                  className={`flex items-center gap-3 p-4 ${
                    index !== tokens.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  {/* Token Icon */}
                  <div className="w-10 h-10 bg-surface-elevated rounded-full flex items-center justify-center text-sm font-semibold text-text-primary">
                    {token.icon}
                  </div>

                  {/* Token Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{token.symbol}</p>
                    <p className="text-xs text-text-muted">{token.name}</p>
                  </div>

                  {/* Balance */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">
                      {token.balanceFormatted}
                    </p>
                    <p className="text-xs text-text-muted">
                      {token.symbol === 'SUI' || token.symbol === 'MSUI'
                        ? `$${(parseFloat(token.balanceFormatted.replace(/,/g, '')) * 0.5).toFixed(2)}`
                        : `$${parseFloat(token.balanceFormatted.replace(/,/g, '')).toFixed(2)}`
                      }
                    </p>
                  </div>
                </div>
              ))
            )}
          </Card>
        </motion.div>
      </div>
    </AuthGuard>
  );
}
