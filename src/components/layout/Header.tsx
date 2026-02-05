'use client';

import React, { useState } from 'react';
import { Coins, User, LogIn, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Navigation } from './Navigation';

export const Header: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    // Mock login - in production this would trigger zkLogin
    const mockAddress = '0x' + Math.random().toString(16).slice(2, 42);
    login(mockAddress);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gold-500/20 bg-dark-900/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-fantasy text-gold-500 text-glow-gold cursor-pointer hover:scale-105 transition-transform">
              NerveCore
            </h1>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <Navigation />
            </div>
          </div>

          {/* Right side - User section */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {/* Balance Display */}
                <div className="currency-display hidden sm:flex">
                  <Coins size={20} className="text-gold-500 animate-pulse" />
                  <span>{user.balance.toLocaleString()} GOLD</span>
                </div>

                {/* User Avatar */}
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-dark-800 border border-purple-500/40 rounded-full hover:border-purple-400 transition-colors cursor-pointer group">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full ring-2 ring-purple-500 group-hover:ring-gold-500 transition-all"
                    />
                  ) : (
                    <User size={20} className="text-purple-400 group-hover:text-gold-500 transition-colors" />
                  )}
                  <span className="text-sm text-gray-300 group-hover:text-gold-500 transition-colors max-w-[120px] truncate">
                    {user.address.slice(0, 6)}...{user.address.slice(-4)}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="hidden sm:block"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleLogin}
                className="hidden sm:flex items-center gap-2"
              >
                <LogIn size={18} />
                Connect Wallet
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-gold-500 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gold-500/20">
            <Navigation mobile onNavigate={() => setMobileMenuOpen(false)} />

            {/* Mobile user section */}
            <div className="mt-4 pt-4 border-t border-gold-500/20 space-y-3">
              {isAuthenticated && user ? (
                <>
                  <div className="currency-display w-full justify-center">
                    <Coins size={20} className="text-gold-500 animate-pulse" />
                    <span>{user.balance.toLocaleString()} GOLD</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 px-4 py-2 bg-dark-800 border border-purple-500/40 rounded-full">
                    {user.avatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full ring-2 ring-purple-500"
                      />
                    )}
                    <span className="text-sm text-gray-300">
                      {user.address.slice(0, 6)}...{user.address.slice(-4)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleLogin}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gradient underline */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-gold-500 to-purple-500 shadow-gold" />
    </header>
  );
};
