'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useZkLogin } from '@/hooks/useZkLogin';
import { motion } from 'framer-motion';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { login: zkLogin, isProcessing } = useZkLogin();

  const handleConnect = () => {
    zkLogin();
  };

  const quickActions = [
    { icon: '⇄', label: 'Swap', color: '#eab308', bg: 'rgba(234,179,8,0.12)', href: '/swap' },
    { icon: '↓', label: 'Lend', color: '#84cc16', bg: 'rgba(132,204,22,0.12)', href: '/lending' },
    { icon: '⚔', label: 'Quests', color: '#f97316', bg: 'rgba(249,115,22,0.12)', href: '/quests' },
    { icon: '◈', label: 'Inventory', color: '#a855f7', bg: 'rgba(168,85,247,0.12)', href: '/wallet' },
  ];

  const features = [
    {
      icon: '⇄',
      title: 'Token Swap',
      desc: 'Exchange MSUI and MUSDC instantly via on-chain AMM',
      href: '/swap',
      color: '#eab308',
    },
    {
      icon: '🏦',
      title: 'Lending & Borrowing',
      desc: 'Deposit MSUI, borrow up to 80% LTV in MUSDC',
      href: '/lending',
      color: '#84cc16',
    },
    {
      icon: '💧',
      title: 'Token Faucet',
      desc: 'Get free testnet SUI, MSUI, and MUSDC tokens',
      href: '/faucet',
      color: '#6dc2f2',
    },
  ];

  return (
    <motion.div
      className="space-y-5"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ── Balance Card ── */}
      <motion.div variants={fadeUp}>
        <div
          className="relative overflow-hidden p-5"
          style={{
            background: 'linear-gradient(135deg, #2d2438 0%, #3d3450 60%, #2d2438 100%)',
            border: '3px solid #4a3f5c',
            boxShadow: '4px 4px 0 0 #0d0a14, inset 0 1px 0 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-pixel-lime opacity-40" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-pixel-lime opacity-40" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-pixel-lime opacity-40" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-pixel-lime opacity-40" />

          <p className="font-pixel text-[9px] text-pixel-gold uppercase tracking-widest mb-3">
            Total Balance
          </p>

          {isAuthenticated && user ? (
            <>
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="font-sans text-5xl font-bold text-text-primary"
                  style={{ textShadow: '0 0 20px rgba(132,204,22,0.15)' }}
                >
                  {user.balance.toLocaleString()}
                </span>
                <span className="font-pixel text-[10px] text-text-secondary">SUI</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-pixel-lime/10 border-2 border-pixel-lime">
                  <span className="font-pixel text-[9px] text-pixel-lime">TESTNET</span>
                </div>
                <span className="font-pixel text-[8px] text-text-muted">LIVE</span>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <span className="font-sans text-4xl text-text-muted">$ - - -</span>
              </div>
              <button
                onClick={handleConnect}
                disabled={isProcessing}
                className="btn-primary"
                style={{ fontWeight: 700 }}
              >
                {isProcessing ? '⟳ Connecting...' : '▶ Connect Wallet'}
              </button>
              <p className="font-pixel text-[8px] text-text-muted text-center mt-2 tracking-wider">
                POWERED BY ZKLOGIN
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* ── Quick Actions 2×2 Grid ── */}
      <motion.div variants={fadeUp}>
        <h3 className="section-header px-1">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              variants={fadeUp}
              onClick={() => router.push(action.href)}
              className="relative flex flex-col items-center justify-center gap-2 p-4
                         bg-surface border-[3px] border-border
                         transition-all duration-100
                         active:translate-x-[2px] active:translate-y-[2px]"
              style={{
                boxShadow: '4px 4px 0 0 #0d0a14',
                minHeight: '100px',
              }}
              whileHover={{ borderColor: '#6b5a80' }}
              whileTap={{ x: 2, y: 2, boxShadow: '2px 2px 0 0 #0d0a14' }}
            >
              {/* Icon container */}
              <div
                className="w-11 h-11 flex items-center justify-center text-2xl border-2"
                style={{
                  background: action.bg,
                  borderColor: action.color,
                  color: action.color,
                  boxShadow: `0 0 12px ${action.bg}`,
                }}
              >
                {action.icon}
              </div>
              <span className="font-pixel text-[9px] text-text-secondary uppercase tracking-wider">
                {action.label}
              </span>

              {/* Subtle corner pixel */}
              <div
                className="absolute top-1 right-1 w-1 h-1"
                style={{ background: action.color, opacity: 0.4 }}
              />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Features ── */}
      <motion.div variants={fadeUp}>
        <h3 className="section-header px-1">DeFi Features</h3>
        <div className="space-y-3">
          {features.map((feat) => (
            <motion.div
              key={feat.title}
              variants={fadeUp}
              onClick={() => router.push(feat.href)}
              className="card-interactive cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-2xl border-2 border-border bg-surface-deep"
                  style={{
                    boxShadow: 'inset 2px 2px 0 0 rgba(0,0,0,0.2)',
                  }}
                >
                  {feat.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-pixel text-[10px] text-text-primary uppercase tracking-wide truncate">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-text-muted mt-1 line-clamp-1">
                    {feat.desc}
                  </p>
                </div>

                {/* Chevron */}
                <span className="text-lg text-text-muted ml-1">›</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Footer ── */}
      <motion.div
        variants={fadeUp}
        className="text-center pt-2 pb-2"
      >
        <p className="font-pixel text-[8px] text-text-muted tracking-widest">
          ⚡ POWERED BY SUI NETWORK ⚡
        </p>
      </motion.div>
    </motion.div>
  );
}
