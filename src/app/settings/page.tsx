'use client';

import { motion } from 'framer-motion';
import { ChevronRight, LogOut, Shield, Bell, Moon, HelpCircle, FileText, ExternalLink, LucideIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface SettingsItem {
  icon: LucideIcon;
  label: string;
  value?: string;
  action: () => void;
}

interface SettingsGroup {
  title: string;
  items: SettingsItem[];
}

export default function SettingsPage() {
  const { user, isAuthenticated, logout, login } = useAuth();

  const handleLogin = () => {
    const mockAddress = '0x' + Math.random().toString(16).slice(2, 42);
    login(mockAddress);
  };

  const settingsGroups: SettingsGroup[] = [
    {
      title: 'Preferences',
      items: [
        { icon: Moon, label: 'Dark Mode', value: 'On', action: () => {} },
        { icon: Bell, label: 'Notifications', value: 'Off', action: () => {} },
      ],
    },
    {
      title: 'Security',
      items: [
        { icon: Shield, label: 'Security Settings', action: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', action: () => {} },
        { icon: FileText, label: 'Terms of Service', action: () => {} },
      ],
    },
  ];

  return (
    <div className="py-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Settings
        </h1>
        <p className="text-sm text-text-secondary">
          Manage your preferences
        </p>
      </motion.div>

      {/* Account Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-accent">
                  {user.address.slice(2, 4).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">Connected</p>
                <p className="text-xs text-text-muted font-mono truncate">
                  {user.address.slice(0, 8)}...{user.address.slice(-6)}
                </p>
              </div>
              <a
                href={`https://suiscan.xyz/account/${user.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-elevated transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-text-secondary mb-4">
                Connect your wallet to access all features
              </p>
              <Button variant="primary" size="md" onClick={handleLogin}>
                Connect Wallet
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Settings Groups */}
      {settingsGroups.map((group, groupIndex) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + groupIndex * 0.05 }}
        >
          <h3 className="section-header px-1">{group.title}</h3>
          <Card className="p-0 overflow-hidden">
            {group.items.map((item, index) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-surface-elevated transition-colors ${
                  index !== group.items.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="w-10 h-10 bg-surface-elevated rounded-full flex items-center justify-center">
                  <item.icon size={18} className="text-text-secondary" />
                </div>
                <span className="flex-1 text-sm font-medium text-text-primary">
                  {item.label}
                </span>
                {item.value && (
                  <span className="text-sm text-text-muted mr-2">
                    {item.value}
                  </span>
                )}
                <ChevronRight size={16} className="text-text-muted" />
              </button>
            ))}
          </Card>
        </motion.div>
      ))}

      {/* Logout Button */}
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="danger"
            size="lg"
            icon={<LogOut size={18} />}
            onClick={logout}
          >
            Disconnect Wallet
          </Button>
        </motion.div>
      )}

      {/* Version */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center pt-4"
      >
        <p className="text-xs text-text-muted">
          NerveCore v1.0.0
        </p>
      </motion.div>
    </div>
  );
}
