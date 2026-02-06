'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthSession, ZkLoginState } from '@/types/zklogin';
import { suiClient } from '@/lib/sui-client';
import { MIST_PER_SUI } from '@mysten/sui/utils';

interface User {
  address: string;
  balance: number;
  avatar?: string;
}

interface AuthContextType extends ZkLoginState {
  session: AuthSession | null;
  user: User | null;
  setSession: (session: AuthSession | null) => void;
  clearSession: () => void;
  restoreSession: () => void;
  login: (address: string) => void;
  logout: () => void;
  refreshBalance: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'zklogin_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch SUI balance for an address
  const fetchBalance = useCallback(async (address: string) => {
    try {
      const result = await suiClient.getBalance({
        owner: address,
        coinType: '0x2::sui::SUI',
      });
      const suiBalance = Number(result.totalBalance) / Number(MIST_PER_SUI);
      setBalance(suiBalance);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setBalance(0);
    }
  }, []);

  // Public method to refresh balance
  const refreshBalance = useCallback(async () => {
    if (session?.address) {
      await fetchBalance(session.address);
    }
  }, [session, fetchBalance]);

  // Restore session from localStorage
  const restoreSession = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      if (typeof window === 'undefined') return;

      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setIsLoading(false);
        return;
      }

      const parsed = JSON.parse(stored) as AuthSession;

      if (!parsed.address || !parsed.jwt || !parsed.ephemeralKeyPair) {
        console.warn('Invalid session structure, clearing');
        localStorage.removeItem(STORAGE_KEY);
        setIsLoading(false);
        return;
      }

      setSessionState(parsed);
      // Fetch balance for restored session
      fetchBalance(parsed.address);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to restore session:', err);
      setError('Failed to restore session');
      localStorage.removeItem(STORAGE_KEY);
      setIsLoading(false);
    }
  }, [fetchBalance]);

  // Persist session to localStorage
  const setSession = useCallback((newSession: AuthSession | null) => {
    try {
      setError(null);

      if (newSession) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
        setSessionState(newSession);
        // Fetch balance for new session
        fetchBalance(newSession.address);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setSessionState(null);
        setBalance(0);
      }
    } catch (err) {
      console.error('Failed to save session:', err);
      setError('Failed to save session');
    }
  }, [fetchBalance]);

  // Clear session
  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSessionState(null);
      setBalance(0);
      setError(null);
    } catch (err) {
      console.error('Failed to clear session:', err);
      setError('Failed to clear session');
    }
  }, []);

  // Dev login fallback (for when no Google Client ID is configured)
  const login = useCallback((address: string) => {
    const mockSession: AuthSession = {
      address,
      jwt: 'dev-mode',
      ephemeralKeyPair: {
        privateKey: 'dev-private-key',
        publicKey: 'dev-public-key',
      },
      zkProof: null,
      maxEpoch: 0,
      randomness: 'dev-randomness',
      isAuthenticated: true,
    };
    setSession(mockSession);
  }, [setSession]);

  // Logout alias for clearSession
  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  // Auto-restore session on mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const value: AuthContextType = {
    session,
    address: session?.address || null,
    isAuthenticated: session?.isAuthenticated || false,
    isLoading,
    error,
    user: session ? { address: session.address, balance, avatar: undefined } : null,
    setSession,
    clearSession,
    restoreSession,
    login,
    logout,
    refreshBalance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
