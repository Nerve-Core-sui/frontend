'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { TransactionOverlay } from '@/components/transaction/TransactionOverlay';
import { SplashScreen } from '@/components/splash';
import { useSplashScreen } from '@/hooks/useSplashScreen';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { showSplash, isVisible, hideSplash } = useSplashScreen();

  return (
    <>
      {/* Splash Screen */}
      <AnimatePresence mode="wait">
        {showSplash && isVisible && (
          <SplashScreen onComplete={hideSplash} />
        )}
      </AnimatePresence>

      {/* Main App */}
      <div className="min-h-screen bg-background text-text-primary">
        {/* Top bar */}
        <TopBar />

        {/* Main content */}
        <main className="px-4 pb-24">
          {children}
        </main>

        {/* Bottom navigation */}
        <BottomNav />

        {/* Transaction progress overlay */}
        <TransactionOverlay />
      </div>
    </>
  );
};
