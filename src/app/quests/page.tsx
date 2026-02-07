'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Landmark, Layers, ChevronRight, Zap, AlertCircle, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useExecuteTransaction } from '@/hooks/useExecuteTransaction';

interface QuestType {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  steps: string[];
  actionLabel: string;
  href: string;
  locked?: boolean;
}

export default function QuestsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { hasProof } = useExecuteTransaction();

  const questTypes: QuestType[] = [
    {
      id: 'swap',
      title: 'Swap Quest',
      subtitle: 'Token Trading',
      description: 'Exchange tokens on the AMM decentralized exchange. Swap between MSUI and MUSDC with automatic price discovery.',
      icon: <ArrowLeftRight size={28} className="text-pixel-gold" />,
      color: '#eab308',
      bg: 'rgba(234,179,8,0.12)',
      steps: [
        'Choose swap direction (MSUI → MUSDC or MUSDC → MSUI)',
        'Enter the amount to swap',
        'Review estimated output and price impact',
        'Confirm the swap transaction on-chain',
      ],
      actionLabel: 'Go to Swap',
      href: '/swap',
    },
    {
      id: 'yield',
      title: 'Yield Quest',
      subtitle: 'Lending Vault',
      description: 'Stake your MSUI tokens in the lending vault to earn yield. Your deposits are locked in a smart contract and earn interest from borrowers.',
      icon: <Landmark size={28} className="text-pixel-lime" />,
      color: '#84cc16',
      bg: 'rgba(132,204,22,0.12)',
      steps: [
        'Navigate to the Lending page',
        'Enter MSUI amount to deposit',
        'Confirm deposit transaction',
        'Receive a LendingReceipt NFT as proof',
      ],
      actionLabel: 'Go to Lending',
      href: '/lending',
    },
    {
      id: 'leverage',
      title: 'Leverage Quest',
      subtitle: 'Leveraged Position',
      description: 'Build a multi-step leveraged position using lending and swap. Deposit MSUI, borrow MUSDC against it, swap back to MSUI, and deposit again for amplified exposure.',
      icon: <Layers size={28} className="text-purple-400" />,
      color: '#a855f7',
      bg: 'rgba(168,85,247,0.12)',
      steps: [
        'Deposit MSUI into the lending pool',
        'Borrow MUSDC against your deposit (80% LTV)',
        'Swap borrowed MUSDC back to MSUI',
        'Deposit the new MSUI for leveraged exposure',
      ],
      actionLabel: 'Coming Soon',
      href: '/lending',
      locked: true,
    },
  ];

  const handleStartQuest = (questId: string, href: string) => {
    router.push(href);
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
            Quests
          </h1>
          <p className="text-sm text-text-secondary">
            Complete DeFi quests to master on-chain finance
          </p>
        </motion.div>

        {/* No Proof Warning */}
        {!hasProof && isAuthenticated && (
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
                    Quests require transaction signing. Please log out and log back in to refresh your ZK proof.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Quest Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div
            className="relative overflow-hidden p-5"
            style={{
              background: 'linear-gradient(135deg, #2d2438 0%, #3d3450 60%, #2d2438 100%)',
              border: '3px solid #4a3f5c',
              boxShadow: '4px 4px 0 0 #0d0a14',
            }}
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-pixel-gold opacity-40" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-pixel-gold opacity-40" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-pixel-gold opacity-40" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-pixel-gold opacity-40" />

            <p className="font-pixel text-[9px] text-pixel-gold uppercase tracking-widest mb-2">
              Quest Board
            </p>
            <p className="text-2xl font-bold text-text-primary">
              2 Quests Available
            </p>
            <p className="text-sm text-text-muted mt-1">
              Each quest teaches a different DeFi strategy
            </p>

            <div className="flex gap-3 mt-4">
              {questTypes.map((q) => (
                <div
                  key={q.id}
                  className={`flex-1 flex items-center justify-center gap-2 p-2 border-2 border-border bg-surface-deep ${q.locked ? 'opacity-40' : ''}`}
                >
                  <div className="w-6 h-6 flex items-center justify-center" style={{ color: q.locked ? '#666' : q.color }}>
                    {q.id === 'swap' && <ArrowLeftRight size={16} />}
                    {q.id === 'yield' && <Landmark size={16} />}
                    {q.id === 'leverage' && (q.locked ? <Lock size={16} /> : <Layers size={16} />)}
                  </div>
                  <span className="font-pixel text-[8px] text-text-muted uppercase">{q.id}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quest Cards */}
        {questTypes.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08 }}
          >
            <Card className="p-0 overflow-hidden">
              {/* Quest Header */}
              <div
                className="p-4 flex items-center gap-4"
                style={{ background: quest.bg }}
              >
                <div
                  className="w-14 h-14 flex items-center justify-center border-2 flex-shrink-0"
                  style={{ borderColor: quest.color, background: 'rgba(0,0,0,0.3)' }}
                >
                  {quest.icon}
                </div>
                <div className="flex-1">
                  <p className="font-pixel text-[10px] uppercase tracking-wider" style={{ color: quest.color }}>
                    {quest.subtitle}
                  </p>
                  <h3 className="text-lg font-bold text-text-primary mt-0.5">
                    {quest.title}
                  </h3>
                </div>
                <Zap size={20} style={{ color: quest.color }} />
              </div>

              {/* Quest Body */}
              <div className={`p-4 space-y-4 ${quest.locked ? 'opacity-50' : ''}`}>
                <p className="text-sm text-text-secondary">
                  {quest.description}
                </p>

                {/* Steps */}
                <div className="space-y-2">
                  <p className="font-pixel text-[9px] text-text-muted uppercase tracking-wider">
                    Quest Steps
                  </p>
                  {quest.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 flex-shrink-0 flex items-center justify-center border-2 border-border bg-surface-deep font-pixel text-[9px]"
                        style={{ color: quest.color }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-xs text-text-secondary pt-1">{step}</p>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={quest.locked || !hasProof || (user?.balance ?? 0) < 0.01}
                  onClick={() => !quest.locked && handleStartQuest(quest.id, quest.href)}
                  icon={quest.locked ? <Lock size={16} /> : <ChevronRight size={16} />}
                >
                  {quest.actionLabel}
                </Button>

                {quest.locked && (
                  <p className="text-xs text-text-muted text-center">
                    This quest is not yet available
                  </p>
                )}

                {!quest.locked && (user?.balance ?? 0) < 0.01 && hasProof && (
                  <p className="text-xs text-warning text-center">
                    Get SUI first from the Faucet to pay gas fees
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-accent/5 border-accent/20">
            <p className="text-xs text-text-secondary">
              <strong className="text-accent">How quests work:</strong> Each quest guides you through a DeFi strategy.
              Click the action button to start. Swap Quest uses the AMM DEX, Yield Quest deposits into lending vaults,
              and Leverage Quest combines both for amplified positions. All transactions execute on-chain via Sui Move contracts.
            </p>
          </Card>
        </motion.div>
      </div>
    </AuthGuard>
  );
}
