'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', icon: '⌂', label: 'Home' },
  { href: '/quests', icon: '⚔', label: 'Quests' },
  { href: '/wallet', icon: '◈', label: 'Wallet' },
  { href: '/settings', icon: '⚙', label: 'Settings' },
];

export const AppBottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="phone-nav">
      <div className="flex items-stretch justify-around">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item relative flex-1 ${isActive ? 'nav-item-active' : ''}`}
            >
              {/* Pixel arrow indicator ABOVE icon */}
              {isActive && (
                <motion.div
                  layoutId="nav-arrow"
                  className="absolute -top-[3px] left-1/2 -translate-x-1/2"
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                >
                  {/* Pixel arrow: ▼ built from 3 stacked rows */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-[3px] bg-pixel-lime" style={{ boxShadow: '0 0 6px rgba(132,204,22,0.6)' }} />
                    <div className="w-2 h-[3px] bg-pixel-lime" />
                    <div className="w-1 h-[3px] bg-pixel-lime" />
                  </div>
                </motion.div>
              )}

              {/* Icon */}
              <motion.span
                className="text-2xl leading-none mt-1"
                animate={isActive ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {item.icon}
              </motion.span>

              {/* Label */}
              <span
                className={`font-pixel text-[7px] uppercase tracking-wider ${
                  isActive ? 'text-pixel-lime' : 'text-text-muted'
                }`}
              >
                {item.label}
              </span>

              {/* Glow underline for active */}
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute bottom-0 left-1/4 right-1/4 h-[2px]"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #84cc16, transparent)',
                    boxShadow: '0 0 8px rgba(132,204,22,0.4)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Safe area spacer */}
      <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} className="bg-surface" />
    </nav>
  );
};
