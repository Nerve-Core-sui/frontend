'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', icon: '⌂', label: 'Home' },
  { href: '/quests', icon: '⚔', label: 'Quests' },
  { href: '/wallet', icon: '◈', label: 'Inventory' },
  { href: '/settings', icon: '⚙', label: 'Settings' },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t-2 border-border">
      <div className="flex items-center justify-around px-2 pt-2 pb-safe-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item relative flex-1 ${isActive ? 'nav-item-active' : ''}`}
            >
              <div className="relative flex flex-col items-center gap-1">
                <span
                  className={`text-2xl transition-all duration-100 ${
                    isActive ? 'scale-110' : ''
                  }`}
                  style={{ filter: isActive ? 'drop-shadow(0 0 4px currentColor)' : 'none' }}
                >
                  {item.icon}
                </span>
                <span className="font-pixel text-[8px] uppercase tracking-wide">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-pixel-gold"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{
                      boxShadow: '0 0 4px currentColor',
                      borderRadius: 0
                    }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Safe area spacer for notch devices */}
      <div className="h-safe-bottom bg-surface" />
    </nav>
  );
};
