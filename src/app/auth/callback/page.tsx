'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useZkLogin } from '@/hooks/useZkLogin';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { handleCallback } = useZkLogin();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Authenticating...');
  const processingRef = useRef(false);

  const processCallback = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    try {
      setError(null);
      setStatus('Verifying identity & generating ZK proof...');

      await handleCallback();
      setStatus('Success! Redirecting...');
      router.replace('/');
    } catch (err) {
      console.error('Auth callback error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      processingRef.current = false;
    }
  }, [handleCallback, router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (!hash.includes('id_token=')) {
      setError('No authentication token found. Please try logging in again.');
      return;
    }

    processCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    processCallback();
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 p-6">
      {error ? (
        <>
          <div
            className="w-16 h-16 flex items-center justify-center text-3xl border-2 border-pixel-red bg-pixel-red/10"
            style={{ boxShadow: '3px 3px 0 0 #0d0a14' }}
          >
            ✕
          </div>
          <h2 className="font-pixel text-[12px] text-pixel-red uppercase tracking-wider">
            Auth Failed
          </h2>
          <p className="font-pixel text-[9px] text-text-secondary text-center max-w-xs">
            {error}
          </p>
          {error.includes('prover') || error.includes('Prover') || error.includes('500') ? (
            <p className="font-pixel text-[8px] text-text-muted text-center max-w-xs">
              The ZK prover service may be temporarily overloaded. Try again.
            </p>
          ) : null}
          <div className="flex gap-3 mt-4">
            <button onClick={handleRetry} className="btn-primary">
              ↻ Retry
            </button>
            <button
              onClick={() => router.replace('/')}
              className="px-4 py-2 bg-surface border-[3px] border-border font-pixel text-[10px] text-text-secondary uppercase tracking-wider"
              style={{ boxShadow: '3px 3px 0 0 #0d0a14' }}
            >
              ◄ Home
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="relative">
            <div
              className="w-16 h-16 flex items-center justify-center border-2 border-pixel-lime bg-pixel-lime/10"
              style={{ boxShadow: '3px 3px 0 0 #0d0a14' }}
            >
              <div className="w-6 h-6 border-2 border-pixel-lime border-t-transparent animate-spin" />
            </div>
          </div>
          <h2 className="font-pixel text-[12px] text-pixel-lime uppercase tracking-wider">
            {status}
          </h2>
          <p className="font-pixel text-[8px] text-text-muted tracking-widest">
            PROCESSING ZKLOGIN PROOF
          </p>
          <p className="font-pixel text-[7px] text-text-muted tracking-wider mt-1">
            This may take 10-30 seconds...
          </p>
          <div className="w-48 h-2 bg-surface-deep border border-border mt-2 overflow-hidden">
            <div
              className="h-full bg-pixel-lime animate-pulse"
              style={{ width: '60%', transition: 'width 1s ease' }}
            />
          </div>
        </>
      )}
    </div>
  );
}
