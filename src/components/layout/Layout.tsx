'use client';

import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-fantasy noise-overlay">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-gold-900/10 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main layout */}
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative border-t border-gold-500/20 bg-dark-900/50 backdrop-blur-sm mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
              <p className="font-fantasy text-gold-500/70">
                NerveCore &copy; 2024 - Conquer DeFi
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-gold-500 transition-colors">
                  About
                </a>
                <a href="#" className="hover:text-gold-500 transition-colors">
                  Documentation
                </a>
                <a href="#" className="hover:text-gold-500 transition-colors">
                  Community
                </a>
              </div>
            </div>
          </div>

          {/* Bottom gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-gold-500 to-purple-500 shadow-gold" />
        </footer>
      </div>
    </div>
  );
};
