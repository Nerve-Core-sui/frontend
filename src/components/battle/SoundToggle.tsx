'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export interface SoundToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ isMuted, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-6 right-6 z-[60] p-3 rounded-full bg-dark-800/80 border border-gold-500/30 backdrop-blur-sm hover:bg-dark-800 hover:border-gold-500 transition-all duration-300 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={isMuted ? 'Unmute' : 'Mute'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isMuted ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-gray-400 group-hover:text-gray-300" />
        ) : (
          <Volume2 className="w-5 h-5 text-gold-500 group-hover:text-gold-400" />
        )}
      </motion.div>

      {/* Pulse effect when unmuted */}
      {!isMuted && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-gold-500"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};
