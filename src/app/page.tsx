'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, login } = useAuth();

  const handleLogin = () => {
    const mockAddress = '0x' + Math.random().toString(16).slice(2, 42);
    login(mockAddress);
  };

  const quickActions = [
    { icon: '⇅', label: 'Swap', color: 'text-pixel-gold', href: '/quests' },
    { icon: '↓', label: 'Deposit', color: 'text-pixel-green', href: '/quests' },
    { icon: '↗', label: 'Leverage', color: 'text-pixel-orange', href: '/quests' },
    { icon: '💧', label: 'Faucet', color: 'text-pixel-blue', href: '/faucet' },
  ];

  const recentActivity = [
    { type: 'swap', icon: '⇅', description: 'Swapped 10 SUI for USDC', time: '2 min ago', color: 'text-pixel-gold' },
    { type: 'deposit', icon: '↓', description: 'Deposited 50 SUI', time: '1 hour ago', color: 'text-pixel-green' },
    { type: 'leverage', icon: '↗', description: 'Opened 2x position', time: '3 hours ago', color: 'text-pixel-orange' },
  ];

  return (
    <div className="py-4 space-y-6 px-4">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 bg-gradient-to-br from-surface to-surface-elevated">
          <p className="font-pixel text-xs text-pixel-gold mb-2 uppercase">Total Balance</p>
          {isAuthenticated && user ? (
            <>
              <h2 className="font-sans text-5xl font-bold text-text-primary mb-2">
                {user.balance.toLocaleString()} <span className="text-2xl text-text-secondary">SUI</span>
              </h2>
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-pixel-green/20 border-2 border-pixel-green" style={{ borderRadius: '4px' }}>
                <span className="text-lg">↗</span>
                <span className="font-pixel text-xs text-pixel-green">+2.4% TODAY</span>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-pixel text-4xl text-text-muted mb-4">- - -</h2>
              <Button variant="primary" size="lg" onClick={handleLogin}>
                Connect Wallet
              </Button>
            </>
          )}
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h3 className="section-header px-1">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              onClick={() => router.push(action.href)}
              className="flex flex-col items-center gap-2 p-3 bg-surface border-2 border-border
                         hover:border-border-light shadow-pixel transition-all duration-100
                         active:translate-x-1 active:translate-y-1 active:shadow-pixel-sm"
              style={{ borderRadius: '4px' }}
            >
              <div className={`w-12 h-12 bg-surface-elevated border-2 border-border flex items-center justify-center text-2xl ${action.color}`}
                   style={{ borderRadius: '4px' }}>
                {action.icon}
              </div>
              <span className="font-pixel text-[8px] text-text-secondary uppercase">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Featured Quest */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h3 className="section-header px-1">Featured Quest</h3>
        <Card
          interactive
          onClick={() => router.push('/quests')}
          className="p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-pixel-gold/20 border-2 border-pixel-gold flex items-center justify-center text-4xl flex-shrink-0"
                 style={{ borderRadius: '4px' }}>
              🪙
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-pixel text-xs text-text-primary uppercase mb-1">Token Swap</h4>
              <p className="font-sans text-sm text-text-secondary mb-2">Swap tokens with optimal rates</p>
              <div className="flex items-center gap-2">
                <span className="badge-success">Beginner</span>
                <span className="font-pixel text-[10px] text-text-muted">~0.5% APY</span>
              </div>
            </div>
            <span className="text-2xl text-text-muted">›</span>
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="section-header px-1">Recent Activity</h3>
          <Card className="p-0 overflow-hidden">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 ${
                  index !== recentActivity.length - 1 ? 'border-b-2 border-border' : ''
                }`}
              >
                <div className={`w-10 h-10 bg-surface-elevated border-2 border-border flex items-center justify-center text-xl ${activity.color}`}
                     style={{ borderRadius: '4px' }}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-base text-text-primary truncate">
                    {activity.description}
                  </p>
                  <p className="font-pixel text-[10px] text-text-muted">{activity.time}</p>
                </div>
                <div className="w-2 h-2 bg-pixel-green" style={{ borderRadius: 0 }} />
              </div>
            ))}
          </Card>
        </motion.div>
      )}

      {/* Powered by */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-4 pb-2"
      >
        <p className="font-pixel text-[10px] text-text-muted">
          POWERED BY SUI NETWORK
        </p>
      </motion.div>
    </div>
  );
}
