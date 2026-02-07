'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { ArrowLeftRight, Landmark, Droplets, Settings, Swords } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Swap',
    href: '/swap',
    icon: <ArrowLeftRight size={20} />,
  },
  {
    label: 'Lending',
    href: '/lending',
    icon: <Landmark size={20} />,
  },
  {
    label: 'Faucet',
    href: '/faucet',
    icon: <Droplets size={20} />,
  },
  {
    label: 'Quests',
    href: '/quests',
    icon: <Swords size={20} />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings size={20} />,
  },
];

interface NavigationProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ mobile = false, onNavigate }) => {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded transition-all duration-200',
                isActive
                  ? 'bg-dark-700 border-l-4 border-gold-500 text-gold-500'
                  : 'text-gray-300 hover:bg-dark-700 hover:text-gold-500 border-l-4 border-transparent'
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx('nav-link flex items-center gap-2', isActive && 'active')}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
