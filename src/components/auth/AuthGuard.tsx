'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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
  const { isAuthenticated, isLoading, login } = useAuth();

  const handleLogin = () => {
    const mockAddress = '0x' + Math.random().toString(16).slice(2, 42);
    login(mockAddress);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {loadingFallback || (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 size={32} className="text-accent animate-spin" />
            <p className="text-sm text-text-secondary">Loading...</p>
          </motion.div>
        )}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-8">
        {fallback || (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 text-center max-w-sm mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-accent/20 rounded-full flex items-center justify-center">
                <LogIn size={28} className="text-accent" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Connect Wallet
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Connect your wallet to access this feature
              </p>
              <Button variant="primary" size="lg" onClick={handleLogin}>
                Connect Wallet
              </Button>
              <p className="mt-4 text-xs text-text-muted">
                Powered by zkLogin on Sui
              </p>
            </Card>
          </motion.div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
