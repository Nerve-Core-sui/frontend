'use client';

import { motion } from 'framer-motion';
import { Copy, ExternalLink, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth';

export default function WalletPage() {
  const { user } = useAuth();

  const tokens = [
    { symbol: 'SUI', name: 'Sui', balance: user?.balance || 0, value: '$124.50', change: '+2.4%', positive: true },
    { symbol: 'USDC', name: 'USD Coin', balance: 50.00, value: '$50.00', change: '0%', positive: true },
    { symbol: 'WETH', name: 'Wrapped ETH', balance: 0.025, value: '$45.00', change: '-1.2%', positive: false },
  ];

  const copyAddress = () => {
    if (user?.address) {
      navigator.clipboard.writeText(user.address);
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
            Wallet
          </h1>
          <p className="text-sm text-text-secondary">
            Manage your assets
          </p>
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
              >
                <Copy size={16} />
              </button>
              <a
                href={`https://suiscan.xyz/account/${user?.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-elevated transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 gap-3"
        >
          <Button variant="primary" size="md" icon={<ArrowUpRight size={18} />}>
            Send
          </Button>
          <Button variant="secondary" size="md" icon={<ArrowDownLeft size={18} />}>
            Receive
          </Button>
        </motion.div>

        {/* Token List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="section-header px-1">Tokens</h3>
          <Card className="p-0 overflow-hidden">
            {tokens.map((token, index) => (
              <div
                key={token.symbol}
                className={`flex items-center gap-3 p-4 ${
                  index !== tokens.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                {/* Token Icon */}
                <div className="w-10 h-10 bg-surface-elevated rounded-full flex items-center justify-center text-sm font-semibold text-text-primary">
                  {token.symbol.slice(0, 2)}
                </div>

                {/* Token Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{token.symbol}</p>
                  <p className="text-xs text-text-muted">{token.name}</p>
                </div>

                {/* Balance */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-primary">
                    {token.balance.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-xs text-text-muted">{token.value}</span>
                    <span className={`text-xs ${token.positive ? 'text-success' : 'text-error'}`}>
                      {token.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </motion.div>
      </div>
    </AuthGuard>
  );
}
