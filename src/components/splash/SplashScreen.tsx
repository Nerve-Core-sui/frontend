'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showLogo, setShowLogo] = useState(false);
  const logoText = 'NERVECORE';

  useEffect(() => {
    // Start logo animation after stars appear
    const logoTimer = setTimeout(() => setShowLogo(true), 500);

    // Complete splash after full sequence
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Generate star positions
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 0.5,
  }));

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1520 0%, #0f0a15 100%)',
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2.5 }}
    >
      {/* Pixel Stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute pixel-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0.6, 1, 0.4, 1],
            }}
            transition={{
              duration: 2,
              delay: star.delay,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Treasure Chest Pixel Art (Optional decoration) */}
      <motion.div
        className="absolute"
        style={{ bottom: '25%' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="pixel-chest">
          <div className="chest-row chest-lock"></div>
          <div className="chest-row chest-top"></div>
          <div className="chest-row chest-bottom"></div>
        </div>
      </motion.div>

      {/* NERVECORE Logo */}
      {showLogo && (
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex gap-1 mb-4">
            {logoText.split('').map((letter, index) => (
              <motion.div
                key={index}
                className="pixel-letter"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.15,
                  delay: 0.5 + index * 0.1,
                  ease: [0, 0, 1, 1],
                }}
              >
                <motion.span
                  className="inline-block"
                  animate={{
                    textShadow: [
                      '0 0 8px rgba(247, 211, 89, 0.4)',
                      '0 0 16px rgba(247, 211, 89, 0.6)',
                      '0 0 8px rgba(247, 211, 89, 0.4)',
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 1.5,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                >
                  {letter}
                </motion.span>
              </motion.div>
            ))}
          </div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.8 }}
            className="pixel-subtitle"
          >
            DeFi Adventures
          </motion.div>
        </div>
      )}

      <style jsx>{`
        .pixel-star {
          background: #f7d359;
          box-shadow: 0 0 2px rgba(247, 211, 89, 0.8);
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }

        .pixel-letter {
          font-family: 'Courier New', monospace;
          font-size: 48px;
          font-weight: 900;
          color: #f7d359;
          text-shadow:
            2px 2px 0 #2a1f1a,
            -1px -1px 0 #2a1f1a,
            1px -1px 0 #2a1f1a,
            -1px 1px 0 #2a1f1a,
            0 0 8px rgba(247, 211, 89, 0.4);
          letter-spacing: 2px;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }

        .pixel-subtitle {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: 600;
          color: #a1a1aa;
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        .pixel-chest {
          width: 48px;
          height: 48px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          filter: drop-shadow(0 4px 8px rgba(247, 211, 89, 0.3));
        }

        .chest-row {
          height: 14px;
          background: #d4a528;
          border: 2px solid #2a1f1a;
          box-sizing: border-box;
          position: relative;
        }

        .chest-lock {
          height: 8px;
          background: #8b7021;
          border-radius: 2px 2px 0 0;
        }

        .chest-lock::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 6px;
          background: #f7d359;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 1px solid #2a1f1a;
          box-sizing: border-box;
        }

        .chest-top {
          background: linear-gradient(to bottom, #f7d359 0%, #d4a528 100%);
          border-radius: 4px 4px 0 0;
        }

        .chest-bottom {
          background: linear-gradient(to bottom, #d4a528 0%, #b08920 100%);
          height: 18px;
        }

        .chest-bottom::before {
          content: '';
          position: absolute;
          width: 12px;
          height: 2px;
          background: #8b7021;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </motion.div>
  );
}
