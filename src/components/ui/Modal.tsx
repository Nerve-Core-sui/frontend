'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  showDragHandle?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  showDragHandle = true,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle drag to dismiss
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 100 || info.velocity.y > 500) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <div className="bg-surface border-t-4 border-l-2 border-r-2 border-border">
              {/* Drag Handle */}
              {showDragHandle && (
                <div className="flex justify-center pt-4 pb-2">
                  <div className="w-12 h-1 bg-border" style={{ borderRadius: 0 }} />
                </div>
              )}

              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 py-3 border-b-2 border-border">
                  {title && (
                    <h2 className="font-pixel text-sm text-pixel-gold uppercase">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 -mr-2 text-text-muted hover:text-text-primary bg-surface-elevated border-2 border-border hover:border-pixel-gold transition-colors"
                      style={{ borderRadius: '4px' }}
                      aria-label="Close"
                    >
                      <span className="text-lg leading-none">✕</span>
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-6 pb-8 max-h-[70vh] overflow-y-auto hide-scrollbar">
                {children}
              </div>

              {/* Safe area spacer */}
              <div className="h-safe-bottom bg-surface" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
