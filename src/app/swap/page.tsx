'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, AlertCircle, Check, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useExecuteTransaction } from '@/hooks/useExecuteTransaction';
import { suiClient } from '@/lib/sui-client';
import {
  PACKAGE_ID,
  SWAP_POOL,
  parseTokenAmount,
  formatTokenAmount,
} from '@/lib/contracts';
import { Transaction } from '@mysten/sui/transactions';

type SwapDirection = 'msui_to_musdc' | 'musdc_to_msui';

interface PoolReserves {
  msuiReserve: bigint;
  musdcReserve: bigint;
}

export default function SwapPage() {
  const { user, refreshBalance } = useAuth();
  const { execute, isExecuting, hasProof } = useExecuteTransaction();

  const [direction, setDirection] = useState<SwapDirection>('msui_to_musdc');
  const [amount, setAmount] = useState('');
  const [estimatedOut, setEstimatedOut] = useState('');
  const [reserves, setReserves] = useState<PoolReserves | null>(null);
  const [poolExists, setPoolExists] = useState(true);
  const [msuiBalance, setMsuiBalance] = useState('0');
  const [musdcBalance, setMusdcBalance] = useState('0');
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slippage] = useState(1); // 1% default slippage

  const inputToken = direction === 'msui_to_musdc' ? 'MSUI' : 'MUSDC';
  const outputToken = direction === 'msui_to_musdc' ? 'MUSDC' : 'MSUI';
  const inputBalance = direction === 'msui_to_musdc' ? msuiBalance : musdcBalance;

  // Fetch pool reserves
  const fetchPoolReserves = useCallback(async () => {
    if (!SWAP_POOL) {
      setPoolExists(false);
      return;
    }
    try {
      const obj = await suiClient.getObject({
        id: SWAP_POOL,
        options: { showContent: true },
      });

      if (!obj.data?.content || obj.data.content.dataType !== 'moveObject') {
        setPoolExists(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fields = obj.data.content.fields as any;
      const msuiRes = fields.msui_reserve;
      const musdcRes = fields.musdc_reserve;

      // Balance<T> can be serialized as plain string or as object with fields.value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parseBal = (v: any): bigint => {
        if (typeof v === 'string' || typeof v === 'number') return BigInt(String(v));
        if (v?.fields?.value !== undefined) return BigInt(String(v.fields.value));
        if (v?.value !== undefined) return BigInt(String(v.value));
        return BigInt(0);
      };

      setReserves({
        msuiReserve: parseBal(msuiRes),
        musdcReserve: parseBal(musdcRes),
      });
      setPoolExists(true);
    } catch {
      setPoolExists(false);
    }
  }, []);

  // Fetch user token balances
  const fetchBalances = useCallback(async () => {
    if (!user?.address || !PACKAGE_ID) return;

    try {
      const [msuiBal, musdcBal] = await Promise.all([
        suiClient.getBalance({
          owner: user.address,
          coinType: `${PACKAGE_ID}::msui::MSUI`,
        }),
        suiClient.getBalance({
          owner: user.address,
          coinType: `${PACKAGE_ID}::musdc::MUSDC`,
        }),
      ]);
      setMsuiBalance(msuiBal.totalBalance);
      setMusdcBalance(musdcBal.totalBalance);
    } catch {
      // Tokens may not exist yet
    }
  }, [user?.address]);

  useEffect(() => {
    fetchPoolReserves();
    fetchBalances();
  }, [fetchPoolReserves, fetchBalances]);

  // Auto-refresh balances and reserves periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBalances();
      fetchPoolReserves();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchBalances, fetchPoolReserves]);

  // Calculate estimated output using constant product formula
  useEffect(() => {
    if (!amount || !reserves || parseFloat(amount) <= 0) {
      setEstimatedOut('');
      return;
    }

    try {
      const amountIn = parseTokenAmount(amount);
      const reserveIn = direction === 'msui_to_musdc' ? reserves.msuiReserve : reserves.musdcReserve;
      const reserveOut = direction === 'msui_to_musdc' ? reserves.musdcReserve : reserves.msuiReserve;

      if (reserveIn === BigInt(0) || reserveOut === BigInt(0)) {
        setEstimatedOut('0');
        return;
      }

      // AMM formula: out = (amountIn * 997 * reserveOut) / (reserveIn * 1000 + amountIn * 997)
      const amountInWithFee = amountIn * BigInt(997);
      const numerator = amountInWithFee * reserveOut;
      const denominator = reserveIn * BigInt(1000) + amountInWithFee;
      const out = numerator / denominator;

      setEstimatedOut(formatTokenAmount(out.toString()));
    } catch {
      setEstimatedOut('');
    }
  }, [amount, direction, reserves]);

  const handleFlipDirection = () => {
    setDirection(d => d === 'msui_to_musdc' ? 'musdc_to_msui' : 'msui_to_musdc');
    setAmount('');
    setEstimatedOut('');
    setTxDigest(null);
    setError(null);
  };

  const handleSetMax = () => {
    const bal = parseFloat(formatTokenAmount(inputBalance).replace(/,/g, ''));
    if (bal > 0) {
      setAmount(bal.toString());
    }
  };

  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0 || isExecuting) return;

    setError(null);
    setTxDigest(null);

    try {
      const amountIn = parseTokenAmount(amount);

      // Calculate min output with slippage
      const amountInWithFee = amountIn * BigInt(997);
      const reserveIn = direction === 'msui_to_musdc' ? reserves!.msuiReserve : reserves!.musdcReserve;
      const reserveOut = direction === 'msui_to_musdc' ? reserves!.musdcReserve : reserves!.msuiReserve;
      const numerator = amountInWithFee * reserveOut;
      const denominator = reserveIn * BigInt(1000) + amountInWithFee;
      const expectedOut = numerator / denominator;
      const minOut = expectedOut * BigInt(100 - slippage) / BigInt(100);

      const coinType = direction === 'msui_to_musdc'
        ? `${PACKAGE_ID}::msui::MSUI`
        : `${PACKAGE_ID}::musdc::MUSDC`;

      const swapTarget = direction === 'msui_to_musdc'
        ? `${PACKAGE_ID}::swap::swap_msui_to_musdc_entry`
        : `${PACKAGE_ID}::swap::swap_musdc_to_msui_entry`;

      // Build transaction: merge coins, split exact amount, swap
      const tx = new Transaction();

      // Get all coins of the input type and merge them
      const coins = await suiClient.getCoins({
        owner: user!.address,
        coinType,
      });

      if (coins.data.length === 0) {
        throw new Error(`No ${inputToken} coins found. Claim from faucet first.`);
      }

      // Use first coin as primary, merge others into it
      const primaryCoin = tx.object(coins.data[0].coinObjectId);
      if (coins.data.length > 1) {
        tx.mergeCoins(
          primaryCoin,
          coins.data.slice(1).map(c => tx.object(c.coinObjectId))
        );
      }

      // Split exact amount for the swap
      const [swapCoin] = tx.splitCoins(primaryCoin, [tx.pure.u64(amountIn)]);

      // Execute swap
      tx.moveCall({
        target: swapTarget,
        arguments: [
          tx.object(SWAP_POOL),
          swapCoin,
          tx.pure.u64(minOut),
        ],
      });

      const result = await execute(tx);
      setTxDigest(result.digest);

      // Refresh balances
      await Promise.all([fetchBalances(), refreshBalance()]);
      setAmount('');
      setEstimatedOut('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Swap failed';
      setError(msg);
    }
  };

  // Price rate
  const rate = reserves && reserves.msuiReserve > 0 && reserves.musdcReserve > 0
    ? direction === 'msui_to_musdc'
      ? Number(reserves.musdcReserve) / Number(reserves.msuiReserve)
      : Number(reserves.msuiReserve) / Number(reserves.musdcReserve)
    : null;

  return (
    <AuthGuard>
      <div className="py-4 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Swap</h1>
          <p className="text-sm text-text-secondary">Exchange tokens instantly</p>
        </motion.div>

        {/* No Proof Warning */}
        {!hasProof && (
          <Card className="p-4 bg-warning/5 border-warning/20">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-warning">ZK Proof Required</p>
                <p className="text-xs text-text-secondary mt-1">
                  Please log out and log back in to generate a ZK proof for transactions.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Pool Not Initialized Warning */}
        {!poolExists && (
          <Card className="p-4 bg-warning/5 border-warning/20">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-warning">Swap Pool Not Ready</p>
                <p className="text-xs text-text-secondary mt-1">
                  The swap pool has not been initialized yet. An admin needs to call init_pool with initial liquidity.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Swap Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="p-5 space-y-4">
            {/* From */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-text-muted">From</span>
                <button onClick={handleSetMax} className="text-xs text-accent hover:underline">
                  Balance: {formatTokenAmount(inputBalance)} {inputToken}
                </button>
              </div>
              <div className="flex items-center gap-3 bg-surface-elevated rounded-lg p-3">
                <div className="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center text-sm font-semibold text-accent flex-shrink-0">
                  {inputToken === 'MSUI' ? '💧' : '💵'}
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setTxDigest(null); setError(null); }}
                    className="w-full bg-transparent text-lg font-semibold text-text-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <span className="text-sm font-semibold text-text-secondary">{inputToken}</span>
              </div>
            </div>

            {/* Flip Button */}
            <div className="flex justify-center -my-1">
              <button
                onClick={handleFlipDirection}
                className="w-10 h-10 rounded-full bg-surface-elevated border-2 border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-colors"
              >
                <ArrowDownUp size={18} />
              </button>
            </div>

            {/* To */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-text-muted">To (estimated)</span>
                <span className="text-xs text-text-muted">
                  Balance: {formatTokenAmount(direction === 'msui_to_musdc' ? musdcBalance : msuiBalance)} {outputToken}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-surface-elevated rounded-lg p-3">
                <div className="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center text-sm font-semibold text-accent flex-shrink-0">
                  {outputToken === 'MSUI' ? '💧' : '💵'}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-text-primary">
                    {estimatedOut || '0.00'}
                  </p>
                </div>
                <span className="text-sm font-semibold text-text-secondary">{outputToken}</span>
              </div>
            </div>

            {/* Rate Info */}
            {rate !== null && (
              <div className="pt-2 border-t border-border space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Rate</span>
                  <span className="text-text-secondary">
                    1 {inputToken} ≈ {rate.toFixed(4)} {outputToken}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Fee</span>
                  <span className="text-text-secondary">0.3%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Slippage</span>
                  <span className="text-text-secondary">{slippage}%</span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-xs text-error">{error}</p>
            )}

            {/* Success */}
            {txDigest && (
              <div className="flex items-center gap-2 text-xs text-success">
                <Check size={14} />
                <span>Swap successful!</span>
                <a
                  href={`https://suiscan.xyz/testnet/tx/${txDigest}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline flex items-center gap-1"
                >
                  View TX <ExternalLink size={12} />
                </a>
              </div>
            )}

            {/* Swap Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              loading={isExecuting}
              disabled={
                !hasProof ||
                !poolExists ||
                !amount ||
                parseFloat(amount) <= 0 ||
                (user?.balance ?? 0) < 0.01
              }
              onClick={handleSwap}
            >
              {isExecuting ? 'Swapping...' : `Swap ${inputToken} → ${outputToken}`}
            </Button>
          </Card>
        </motion.div>

        {/* Pool Info */}
        {reserves && poolExists && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="section-header px-1">Pool Info</h3>
            <Card className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">MSUI Reserve</span>
                <span className="text-text-primary font-semibold">
                  {formatTokenAmount(reserves.msuiReserve.toString())}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">MUSDC Reserve</span>
                <span className="text-text-primary font-semibold">
                  {formatTokenAmount(reserves.musdcReserve.toString())}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Price (MSUI/MUSDC)</span>
                <span className="text-text-primary font-semibold">
                  {(Number(reserves.musdcReserve) / Number(reserves.msuiReserve)).toFixed(4)}
                </span>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-accent/5 border-accent/20">
            <p className="text-xs text-text-secondary">
              <strong className="text-accent">How it works:</strong> Swap uses a constant product AMM (x*y=k)
              with 0.3% fee. Your tokens are exchanged atomically on-chain via smart contract.
            </p>
          </Card>
        </motion.div>
      </div>
    </AuthGuard>
  );
}
