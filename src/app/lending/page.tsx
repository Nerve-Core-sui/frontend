'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check, ExternalLink, Landmark, ArrowDownToLine, ArrowUpFromLine, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useExecuteTransaction } from '@/hooks/useExecuteTransaction';
import { suiClient } from '@/lib/sui-client';
import {
  PACKAGE_ID,
  LENDING_POOL,
  CLOCK_OBJECT,
  parseTokenAmount,
  formatTokenAmount,
} from '@/lib/contracts';
import { Transaction } from '@mysten/sui/transactions';

type Tab = 'deposit' | 'borrow' | 'positions';

interface LendingPosition {
  receiptId: string;
  depositAmount: string;
  borrowedAmount: string;
  depositTimestamp: string;
  maxBorrow: string;
  availableToBorrow: string;
}

interface PoolStats {
  totalDeposits: string;
  totalBorrows: string;
  msuiReserve: string;
  musdcReserve: string;
}

export default function LendingPage() {
  const { user, refreshBalance } = useAuth();
  const { execute, isExecuting, hasProof } = useExecuteTransaction();

  const [tab, setTab] = useState<Tab>('deposit');
  const [amount, setAmount] = useState('');
  const [positions, setPositions] = useState<LendingPosition[]>([]);
  const [poolStats, setPoolStats] = useState<PoolStats | null>(null);
  const [msuiBalance, setMsuiBalance] = useState('0');
  const [musdcBalance, setMusdcBalance] = useState('0');
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch pool stats
  const fetchPoolStats = useCallback(async () => {
    if (!LENDING_POOL) return;
    try {
      const obj = await suiClient.getObject({
        id: LENDING_POOL,
        options: { showContent: true },
      });
      if (!obj.data?.content || obj.data.content.dataType !== 'moveObject') return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fields = obj.data.content.fields as any;
      const msuiRes = fields.msui_reserve;
      const musdcRes = fields.musdc_reserve;

      // Balance<T> can be serialized as plain string or as object with fields.value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parseBal = (v: any): string => {
        if (typeof v === 'string' || typeof v === 'number') return String(v);
        if (v?.fields?.value !== undefined) return String(v.fields.value);
        if (v?.value !== undefined) return String(v.value);
        return '0';
      };

      setPoolStats({
        totalDeposits: String(fields.total_deposits ?? '0'),
        totalBorrows: String(fields.total_borrows ?? '0'),
        msuiReserve: parseBal(msuiRes),
        musdcReserve: parseBal(musdcRes),
      });
    } catch {
      // Pool might not exist
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
      // Tokens may not exist
    }
  }, [user?.address]);

  // Fetch user's lending receipts (positions)
  const fetchPositions = useCallback(async () => {
    if (!user?.address || !PACKAGE_ID) return;
    try {
      const objects = await suiClient.getOwnedObjects({
        owner: user.address,
        filter: {
          StructType: `${PACKAGE_ID}::lending::LendingReceipt`,
        },
        options: { showContent: true },
      });

      const positionList: LendingPosition[] = objects.data
        .filter(o => o.data?.content?.dataType === 'moveObject')
        .map(o => {
          const fields = (o.data!.content as { dataType: 'moveObject'; fields: Record<string, string> }).fields;
          const depositAmount = BigInt(fields.deposit_amount || '0');
          const borrowedAmount = BigInt(fields.borrowed_amount || '0');
          const maxBorrow = (depositAmount * BigInt(80)) / BigInt(100); // 80% LTV
          const availableToBorrow = maxBorrow > borrowedAmount ? maxBorrow - borrowedAmount : BigInt(0);

          return {
            receiptId: o.data!.objectId,
            depositAmount: fields.deposit_amount || '0',
            borrowedAmount: fields.borrowed_amount || '0',
            depositTimestamp: fields.deposit_timestamp || '0',
            maxBorrow: maxBorrow.toString(),
            availableToBorrow: availableToBorrow.toString(),
          };
        });

      setPositions(positionList);
    } catch {
      // No receipts
    }
  }, [user?.address]);

  useEffect(() => {
    fetchPoolStats();
    fetchBalances();
    fetchPositions();
  }, [fetchPoolStats, fetchBalances, fetchPositions]);

  // Auto-refresh balances periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBalances();
      fetchPositions();
      fetchPoolStats();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchBalances, fetchPositions, fetchPoolStats]);

  const refreshAll = async () => {
    setIsRefreshing(true);
    // Wait for chain finalization, then refresh with retries
    await new Promise(r => setTimeout(r, 2000));
    await Promise.all([fetchPoolStats(), fetchBalances(), fetchPositions(), refreshBalance()]);
    // Second refresh after a short delay to catch any propagation delays
    await new Promise(r => setTimeout(r, 1500));
    await Promise.all([fetchPoolStats(), fetchBalances(), fetchPositions()]);
    setIsRefreshing(false);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchPoolStats(), fetchBalances(), fetchPositions(), refreshBalance()]);
    setIsRefreshing(false);
  };

  // Deposit MSUI
  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0 || isExecuting) return;
    setError(null);
    setTxDigest(null);

    try {
      const depositAmount = parseTokenAmount(amount);
      const coinType = `${PACKAGE_ID}::msui::MSUI`;

      const tx = new Transaction();

      const coins = await suiClient.getCoins({ owner: user!.address, coinType });
      if (coins.data.length === 0) throw new Error('No MSUI coins. Claim from faucet first.');

      const primaryCoin = tx.object(coins.data[0].coinObjectId);
      if (coins.data.length > 1) {
        tx.mergeCoins(primaryCoin, coins.data.slice(1).map(c => tx.object(c.coinObjectId)));
      }
      const [depositCoin] = tx.splitCoins(primaryCoin, [tx.pure.u64(depositAmount)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::lending::deposit`,
        arguments: [
          tx.object(LENDING_POOL),
          depositCoin,
          tx.object(CLOCK_OBJECT),
        ],
      });

      const result = await execute(tx);
      setTxDigest(result.digest);
      setAmount('');
      await refreshAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deposit failed');
    }
  };

  // Borrow MUSDC against a position
  const handleBorrow = async () => {
    if (!amount || parseFloat(amount) <= 0 || !selectedPosition || isExecuting) return;
    setError(null);
    setTxDigest(null);

    try {
      const borrowAmount = parseTokenAmount(amount);

      // Client-side validation
      const pos = positions.find(p => p.receiptId === selectedPosition);
      if (pos) {
        const available = BigInt(pos.availableToBorrow);
        if (borrowAmount > available) {
          setError(`Max borrow for this position is ${formatTokenAmount(pos.availableToBorrow)} MUSDC`);
          return;
        }
      }

      // Check pool liquidity
      if (poolStats) {
        const poolMusdc = BigInt(poolStats.musdcReserve);
        if (borrowAmount > poolMusdc) {
          setError(`Insufficient pool liquidity. Pool only has ${formatTokenAmount(poolStats.musdcReserve)} MUSDC available.`);
          return;
        }
      }

      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::lending::borrow`,
        arguments: [
          tx.object(LENDING_POOL),
          tx.object(selectedPosition),
          tx.pure.u64(borrowAmount),
        ],
      });

      const result = await execute(tx);
      setTxDigest(result.digest);
      setAmount('');
      await refreshAll();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Borrow failed';
      if (msg.includes('MoveAbort')) {
        // Extract the error code number from the MoveAbort message
        const codeMatch = msg.match(/,\s*(\d+)\)?/);
        const code = codeMatch ? parseInt(codeMatch[1]) : -1;
        switch (code) {
          case 1:
            setError('Insufficient collateral. Max borrow is 80% of your deposit value.');
            break;
          case 2:
            setError('You can only borrow against your own position.');
            break;
          case 4:
            setError('Insufficient pool MUSDC liquidity. The lending pool needs MUSDC reserves. Try swapping some tokens first or wait for others to repay.');
            break;
          case 6:
            setError('Amount must be greater than zero.');
            break;
          default:
            setError(msg);
        }
      } else {
        setError(msg);
      }
    }
  };

  // Repay MUSDC for a position
  const handleRepay = async (receiptId: string, borrowedAmount: string) => {
    if (isExecuting) return;
    setError(null);
    setTxDigest(null);

    try {
      const repayAmount = BigInt(borrowedAmount);
      if (repayAmount === BigInt(0)) {
        setError('Nothing to repay.');
        return;
      }

      const coinType = `${PACKAGE_ID}::musdc::MUSDC`;
      const tx = new Transaction();

      const coins = await suiClient.getCoins({ owner: user!.address, coinType });
      if (coins.data.length === 0) throw new Error('No MUSDC coins to repay with.');

      const primaryCoin = tx.object(coins.data[0].coinObjectId);
      if (coins.data.length > 1) {
        tx.mergeCoins(primaryCoin, coins.data.slice(1).map(c => tx.object(c.coinObjectId)));
      }
      const [repayCoin] = tx.splitCoins(primaryCoin, [tx.pure.u64(repayAmount)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::lending::repay`,
        arguments: [
          tx.object(LENDING_POOL),
          tx.object(receiptId),
          repayCoin,
        ],
      });

      const result = await execute(tx);
      setTxDigest(result.digest);
      await refreshAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Repay failed');
    }
  };

  // Withdraw MSUI (must have 0 borrowed)
  const handleWithdraw = async (receiptId: string) => {
    if (isExecuting) return;
    setError(null);
    setTxDigest(null);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::lending::withdraw`,
        arguments: [
          tx.object(LENDING_POOL),
          tx.object(receiptId),
        ],
      });

      const result = await execute(tx);
      setTxDigest(result.digest);
      await refreshAll();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Withdraw failed';
      if (msg.includes('MoveAbort') && msg.includes('3')) {
        setError('Repay all borrows before withdrawing.');
      } else {
        setError(msg);
      }
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'deposit', label: 'Deposit', icon: <ArrowDownToLine size={16} /> },
    { key: 'borrow', label: 'Borrow', icon: <Landmark size={16} /> },
    { key: 'positions', label: 'Positions', icon: <ArrowUpFromLine size={16} /> },
  ];

  return (
    <AuthGuard>
      <div className="py-4 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Lending</h1>
          <p className="text-sm text-text-secondary">Deposit MSUI, borrow MUSDC (80% LTV)</p>
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

        {/* Pool Stats */}
        {poolStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center">
                <p className="text-xs text-text-muted">Total Deposits</p>
                <p className="text-lg font-bold text-text-primary">
                  {formatTokenAmount(poolStats.totalDeposits)}
                </p>
                <p className="text-xs text-text-muted">MSUI</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-xs text-text-muted">Total Borrows</p>
                <p className="text-lg font-bold text-text-primary">
                  {formatTokenAmount(poolStats.totalBorrows)}
                </p>
                <p className="text-xs text-text-muted">MUSDC</p>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-1 bg-surface-elevated rounded-lg p-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setAmount(''); setError(null); setTxDigest(null); setSelectedPosition(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-colors ${
                  tab === t.key
                    ? 'bg-accent text-white'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {/* Deposit Tab */}
          {tab === 'deposit' && (
            <Card className="p-5 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-text-muted">Deposit MSUI</span>
                  <button
                    onClick={() => {
                      const bal = parseFloat(formatTokenAmount(msuiBalance).replace(/,/g, ''));
                      if (bal > 0) setAmount(bal.toString());
                    }}
                    className="text-xs text-accent hover:underline"
                  >
                    Balance: {formatTokenAmount(msuiBalance)} MSUI
                  </button>
                </div>
                <div className="flex items-center gap-3 bg-surface-elevated rounded-lg p-3">
                  <div className="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    💧
                  </div>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setTxDigest(null); setError(null); }}
                    className="flex-1 bg-transparent text-lg font-semibold text-text-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-sm font-semibold text-text-secondary">MSUI</span>
                </div>
              </div>

              <div className="text-xs text-text-muted space-y-1">
                <p>- You will receive a LendingReceipt NFT</p>
                <p>- Borrow up to 80% of deposit value in MUSDC</p>
                <p>- 5% APY (display rate)</p>
              </div>

              {error && <p className="text-xs text-error">{error}</p>}
              {txDigest && (
                <div className="flex items-center gap-2 text-xs text-success">
                  <Check size={14} />
                  <span>Deposit successful!</span>
                  <a href={`https://suiscan.xyz/testnet/tx/${txDigest}`} target="_blank" rel="noopener noreferrer" className="text-accent underline flex items-center gap-1">
                    View TX <ExternalLink size={12} />
                  </a>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                loading={isExecuting}
                disabled={!hasProof || !amount || parseFloat(amount) <= 0 || (user?.balance ?? 0) < 0.01}
                onClick={handleDeposit}
              >
                {isExecuting ? 'Depositing...' : 'Deposit MSUI'}
              </Button>
            </Card>
          )}

          {/* Borrow Tab */}
          {tab === 'borrow' && (
            <Card className="p-5 space-y-4">
              {positions.length === 0 ? (
                <div className="text-center py-6">
                  <Landmark size={32} className="mx-auto text-text-muted mb-3" />
                  <p className="text-sm text-text-muted">No positions yet</p>
                  <p className="text-xs text-text-muted mt-1">Deposit MSUI first to borrow against it</p>
                </div>
              ) : (
                <>
                  <div>
                    <span className="text-xs text-text-muted mb-2 block">Select Position</span>
                    <div className="space-y-2">
                      {positions.map(p => (
                        <button
                          key={p.receiptId}
                          onClick={() => setSelectedPosition(p.receiptId)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                            selectedPosition === p.receiptId
                              ? 'border-accent bg-accent/5'
                              : 'border-border bg-surface-elevated hover:border-accent/50'
                          }`}
                        >
                          <div className="flex justify-between text-xs">
                            <span className="text-text-muted">Deposited</span>
                            <span className="text-text-primary font-semibold">{formatTokenAmount(p.depositAmount)} MSUI</span>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-text-muted">Available to borrow</span>
                            <span className="text-accent font-semibold">{formatTokenAmount(p.availableToBorrow)} MUSDC</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedPosition && (
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-text-muted">Borrow MUSDC</span>
                        <span className="text-xs text-text-muted">
                          Max: {formatTokenAmount(positions.find(p => p.receiptId === selectedPosition)?.availableToBorrow || '0')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-surface-elevated rounded-lg p-3">
                        <div className="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                          💵
                        </div>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={e => { setAmount(e.target.value); setTxDigest(null); setError(null); }}
                          className="flex-1 bg-transparent text-lg font-semibold text-text-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-sm font-semibold text-text-secondary">MUSDC</span>
                      </div>
                    </div>
                  )}

                  {error && <p className="text-xs text-error">{error}</p>}
                  {txDigest && (
                    <div className="flex items-center gap-2 text-xs text-success">
                      <Check size={14} />
                      <span>Borrow successful!</span>
                      <a href={`https://suiscan.xyz/testnet/tx/${txDigest}`} target="_blank" rel="noopener noreferrer" className="text-accent underline flex items-center gap-1">
                        View TX <ExternalLink size={12} />
                      </a>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={isExecuting}
                    disabled={!hasProof || !selectedPosition || !amount || parseFloat(amount) <= 0 || (user?.balance ?? 0) < 0.01}
                    onClick={handleBorrow}
                  >
                    {isExecuting ? 'Borrowing...' : 'Borrow MUSDC'}
                  </Button>
                </>
              )}
            </Card>
          )}

          {/* Positions Tab */}
          {tab === 'positions' && (
            <Card className="p-0 overflow-hidden">
              {positions.length === 0 ? (
                <div className="text-center py-8">
                  <Landmark size={32} className="mx-auto text-text-muted mb-3" />
                  <p className="text-sm text-text-muted">No active positions</p>
                  <p className="text-xs text-text-muted mt-1">Deposit MSUI to get started</p>
                </div>
              ) : (
                positions.map((pos, idx) => {
                  const hasBorrow = BigInt(pos.borrowedAmount) > BigInt(0);
                  return (
                    <div
                      key={pos.receiptId}
                      className={`p-4 space-y-3 ${idx !== positions.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-text-muted">
                          {pos.receiptId.slice(0, 8)}...{pos.receiptId.slice(-6)}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          hasBorrow ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                        }`}>
                          {hasBorrow ? 'Active Borrow' : 'No Borrow'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-text-muted">Deposited</span>
                          <p className="text-text-primary font-semibold">{formatTokenAmount(pos.depositAmount)} MSUI</p>
                        </div>
                        <div>
                          <span className="text-text-muted">Borrowed</span>
                          <p className="text-text-primary font-semibold">{formatTokenAmount(pos.borrowedAmount)} MUSDC</p>
                        </div>
                        <div>
                          <span className="text-text-muted">Max Borrow</span>
                          <p className="text-text-secondary">{formatTokenAmount(pos.maxBorrow)} MUSDC</p>
                        </div>
                        <div>
                          <span className="text-text-muted">Available</span>
                          <p className="text-accent">{formatTokenAmount(pos.availableToBorrow)} MUSDC</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {hasBorrow && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1"
                            loading={isExecuting}
                            disabled={!hasProof || (user?.balance ?? 0) < 0.01}
                            onClick={() => handleRepay(pos.receiptId, pos.borrowedAmount)}
                          >
                            Repay All
                          </Button>
                        )}
                        <Button
                          variant={hasBorrow ? 'ghost' : 'secondary'}
                          size="sm"
                          className="flex-1"
                          loading={isExecuting}
                          disabled={!hasProof || hasBorrow || (user?.balance ?? 0) < 0.01}
                          onClick={() => handleWithdraw(pos.receiptId)}
                        >
                          Withdraw
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </Card>
          )}
        </motion.div>

        {/* Error/Success below tabs */}
        {tab === 'positions' && error && (
          <p className="text-xs text-error px-1">{error}</p>
        )}
        {tab === 'positions' && txDigest && (
          <div className="flex items-center gap-2 text-xs text-success px-1">
            <Check size={14} />
            <span>Transaction successful!</span>
            <a href={`https://suiscan.xyz/testnet/tx/${txDigest}`} target="_blank" rel="noopener noreferrer" className="text-accent underline flex items-center gap-1">
              View TX <ExternalLink size={12} />
            </a>
          </div>
        )}

        {/* Balances */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between px-1">
            <h3 className="section-header">Your Balances</h3>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="text-text-muted hover:text-accent transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
          <Card className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">💧 MSUI</span>
              <span className="text-text-primary font-semibold">{formatTokenAmount(msuiBalance)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">💵 MUSDC</span>
              <span className="text-text-primary font-semibold">{formatTokenAmount(musdcBalance)}</span>
            </div>
          </Card>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <Card className="p-4 bg-accent/5 border-accent/20">
            <p className="text-xs text-text-secondary">
              <strong className="text-accent">How it works:</strong> Deposit MSUI as collateral and borrow up to 80% LTV in MUSDC.
              Repay your borrow to unlock collateral withdrawal. All operations are atomic on-chain transactions.
            </p>
          </Card>
        </motion.div>
      </div>
    </AuthGuard>
  );
}
