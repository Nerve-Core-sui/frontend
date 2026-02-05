'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthSession, ZkLoginState } from '@/types/zklogin';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'zklogin_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      // Validate session structure
      if (!parsed.address || !parsed.jwt || !parsed.ephemeralKeyPair) {
        console.warn('Invalid session structure, clearing');
        localStorage.removeItem(STORAGE_KEY);
        setIsLoading(false);
        return;
      }

      // Check if session is still valid (basic expiration check)
      // In production, you'd want to verify JWT expiration here

      setSessionState(parsed);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to restore session:', err);
      setError('Failed to restore session');
      localStorage.removeItem(STORAGE_KEY);
      setIsLoading(false);
    }
  }, []);

  // Persist session to localStorage
  const setSession = useCallback((newSession: AuthSession | null) => {
    try {
      setError(null);

      if (newSession) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
        setSessionState(newSession);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setSessionState(null);
      }
    } catch (err) {
      console.error('Failed to save session:', err);
      setError('Failed to save session');
    }
  }, []);

  // Clear session
  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSessionState(null);
      setError(null);
    } catch (err) {
      console.error('Failed to clear session:', err);
      setError('Failed to clear session');
    }
  }, []);

  // Mock login function for development
  const login = useCallback((address: string) => {
    const mockSession: AuthSession = {
      address,
      jwt: 'mock-jwt-token',
      ephemeralKeyPair: {
        privateKey: 'mock-private-key',
        publicKey: 'mock-public-key',
      },
      zkProof: null,
      maxEpoch: 0,
      randomness: 'mock-randomness',
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
    user: session ? { address: session.address, balance: 0, avatar: undefined } : null,
    setSession,
    clearSession,
    restoreSession,
    login,
    logout,
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
