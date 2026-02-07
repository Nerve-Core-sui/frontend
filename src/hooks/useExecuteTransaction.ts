'use client';

import { useState, useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { getZkLoginSignature } from '@mysten/sui/zklogin';
import { useAuth } from '@/contexts/AuthContext';
import { suiClient } from '@/lib/sui-client';
import { deserializeKeypair, computeAddressSeed, ZK_LOGIN_SALT, getCurrentEpoch } from '@/lib/zklogin/utils';

export interface TransactionResult {
  digest: string;
  effects: {
    status: { status: string };
  };
  objectChanges?: Array<{
    type: string;
    objectType?: string;
    objectId?: string;
  }>;
}

export function useExecuteTransaction() {
  const { session, refreshBalance } = useAuth();
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<TransactionResult | null>(null);

  const execute = useCallback(
    async (tx: Transaction): Promise<TransactionResult> => {
      if (!session || !session.isAuthenticated) {
        throw new Error('Not authenticated');
      }

      if (!session.zkProof) {
        throw new Error('No ZK proof available. Please log out and log back in.');
      }

      // Check if ephemeral key has expired (maxEpoch passed)
      try {
        const currentEpoch = await getCurrentEpoch();
        if (currentEpoch >= session.maxEpoch) {
          throw new Error('Session expired (epoch passed). Please log out and log back in.');
        }
      } catch (epochErr) {
        // If epoch check fails due to network, continue and let the TX fail naturally
        if (epochErr instanceof Error && epochErr.message.includes('Session expired')) {
          throw epochErr;
        }
      }

      setIsExecuting(true);
      setError(null);

      try {
        // Set sender
        tx.setSender(session.address);

        // Build the transaction
        const bytes = await tx.build({ client: suiClient });

        // Sign with ephemeral keypair
        const keypair = deserializeKeypair(session.ephemeralKeyPair);
        const { signature: ephemeralSignature } = await keypair.signTransaction(bytes);

        // Create zkLogin signature
        // Prefer addressSeed from prover response (Enoki returns it), fall back to local computation
        const addressSeed = session.zkProof.addressSeed || computeAddressSeed(session.jwt, ZK_LOGIN_SALT);
        console.log('Using addressSeed:', addressSeed.slice(0, 20) + '...', session.zkProof.addressSeed ? '(from prover)' : '(locally computed)');
        const zkLoginSignature = getZkLoginSignature({
          inputs: {
            ...session.zkProof,
            addressSeed,
          },
          maxEpoch: session.maxEpoch,
          userSignature: ephemeralSignature,
        });

        // Execute on chain
        const result = await suiClient.executeTransactionBlock({
          transactionBlock: bytes,
          signature: zkLoginSignature,
          options: {
            showEffects: true,
            showObjectChanges: true,
          },
        });

        const txResult: TransactionResult = {
          digest: result.digest,
          effects: result.effects as TransactionResult['effects'],
          objectChanges: result.objectChanges as TransactionResult['objectChanges'],
        };

        setLastResult(txResult);
        setIsExecuting(false);

        // Refresh balance after successful transaction
        await refreshBalance();

        return txResult;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Transaction failed';
        console.error('Transaction execution error:', message);

        // Provide helpful error messages
        let userMessage = message;
        if (message.includes('Groth16') || message.includes('proof verify')) {
          userMessage = 'ZK proof expired or invalid. Please log out and log back in to refresh your session.';
        } else if (message.includes('Required Signature') && message.includes('absent')) {
          userMessage = 'Session mismatch. Please log out and log back in.';
        }

        setError(userMessage);
        setIsExecuting(false);
        throw new Error(userMessage);
      }
    },
    [session, refreshBalance]
  );

  const reset = useCallback(() => {
    setError(null);
    setLastResult(null);
  }, []);

  return {
    execute,
    isExecuting,
    error,
    lastResult,
    reset,
    hasProof: !!session?.zkProof,
  };
}
