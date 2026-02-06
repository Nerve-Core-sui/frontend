'use client';

import { useState, useEffect } from 'react';

interface UseSplashScreenReturn {
  showSplash: boolean;
  isVisible: boolean;
  hideSplash: () => void;
}

export function useSplashScreen(): UseSplashScreenReturn {
  const [showSplash, setShowSplash] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if splash has been shown this session
    const hasShownSplash = sessionStorage.getItem('nervecore_splash_shown');

    if (!hasShownSplash) {
      setShowSplash(true);
      setIsVisible(true);
    }
  }, []);

  const hideSplash = () => {
    // Mark splash as shown for this session
    sessionStorage.setItem('nervecore_splash_shown', 'true');
    setIsVisible(false);

    // Remove from DOM after animation
    setTimeout(() => {
      setShowSplash(false);
    }, 500);
  };

  return {
    showSplash,
    isVisible,
    hideSplash,
  };
}
