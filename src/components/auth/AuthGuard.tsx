'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginButton } from './LoginButton';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  fallback,
  loadingFallback,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {loadingFallback || (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-600">Loading...</p>
          </div>
        )}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        {fallback || (
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to DeFi Quest
              </h1>
              <p className="text-gray-600">
                Sign in with your Google account to start your journey
              </p>
            </div>
            <div className="flex justify-center">
              <LoginButton />
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Powered by zkLogin on Sui</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
