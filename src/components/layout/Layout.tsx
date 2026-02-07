'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppHeader } from './AppHeader';
import { AppBottomNav } from './AppBottomNav';
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

      {/* Phone Stage — on desktop this creates the centered mockup background */}
      <div className="phone-stage">
        {/* Phone Device — constrained on desktop, full-screen on mobile */}
        <div className="phone-device scanlines">
          <div className="phone-inner">
            {/* Fixed Header */}
            <AppHeader />

            {/* Scrollable Content */}
            <main className="phone-scroll hide-scrollbar pixel-grid-bg">
              <div className="px-4 py-4 pb-4">
                {children}
              </div>
            </main>

            {/* Fixed Bottom Nav */}
            <AppBottomNav />
          </div>

        </div>
      </div>
    </>
  );
};
