'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { truncateAddress } from '@/lib/zklogin/utils';

interface UserAvatarProps {
  className?: string;
  showAddress?: boolean;
  addressLength?: { start: number; end: number };
}

export function UserAvatar({
  className = '',
  showAddress = true,
  addressLength = { start: 6, end: 4 },
}: UserAvatarProps) {
  const { address, isAuthenticated } = useAuth();

  if (!isAuthenticated || !address) {
    return null;
  }

  const truncated = truncateAddress(address, addressLength.start, addressLength.end);

  // Generate a simple avatar color based on address
  const getAvatarColor = (addr: string): string => {
    const hash = addr.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const avatarColor = getAvatarColor(address);
  const initial = address.slice(2, 3).toUpperCase();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
        style={{ backgroundColor: avatarColor }}
      >
        {initial}
      </div>
      {showAddress && (
        <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
          {truncated}
        </span>
      )}
    </div>
  );
}
