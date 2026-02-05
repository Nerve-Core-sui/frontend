'use client';

import { useEffect, useRef, useState } from 'react';

type SoundType = 'attack' | 'victory' | 'defeat' | 'impact' | 'critical';

interface SoundConfig {
  enabled: boolean;
  volume: number;
}

/**
 * Hook for managing battle sound effects
 * Uses Web Audio API for low-latency sound synthesis
 */
export const useBattleSound = (config: SoundConfig = { enabled: true, volume: 0.3 }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(!config.enabled);

  useEffect(() => {
    // Initialize Audio Context on first user interaction
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const playTone = (frequency: number, duration: number, volume: number, type: OscillatorType = 'sine') => {
    if (isMuted || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume * config.volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const playAttackSound = () => {
    // Swoosh + impact sound
    if (!audioContextRef.current || isMuted) return;

    const ctx = audioContextRef.current;

    // Swoosh (quick frequency sweep)
    const swoosh = ctx.createOscillator();
    const swooshGain = ctx.createGain();
    swoosh.connect(swooshGain);
    swooshGain.connect(ctx.destination);

    swoosh.type = 'sawtooth';
    swoosh.frequency.setValueAtTime(800, ctx.currentTime);
    swoosh.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

    swooshGain.gain.setValueAtTime(0.2 * config.volume, ctx.currentTime);
    swooshGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    swoosh.start(ctx.currentTime);
    swoosh.stop(ctx.currentTime + 0.15);

    // Impact
    setTimeout(() => {
      playTone(150, 0.2, 0.3, 'square');
    }, 100);
  };

  const playVictorySound = () => {
    // Triumphant fanfare
    if (!audioContextRef.current || isMuted) return;

    const notes = [
      { freq: 523.25, time: 0 },      // C5
      { freq: 659.25, time: 0.15 },   // E5
      { freq: 783.99, time: 0.3 },    // G5
      { freq: 1046.50, time: 0.45 },  // C6
    ];

    notes.forEach((note) => {
      setTimeout(() => {
        playTone(note.freq, 0.3, 0.25, 'sine');
      }, note.time * 1000);
    });
  };

  const playDefeatSound = () => {
    // Descending "sad" tone
    if (!audioContextRef.current || isMuted) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1);

    gainNode.gain.setValueAtTime(0.2 * config.volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1);
  };

  const playImpactSound = () => {
    // Heavy impact thud
    playTone(80, 0.3, 0.4, 'square');
  };

  const playCriticalSound = () => {
    // Special critical hit sound
    if (!audioContextRef.current || isMuted) return;

    playTone(1200, 0.05, 0.3, 'square');
    setTimeout(() => {
      playTone(1600, 0.05, 0.3, 'square');
    }, 50);
    setTimeout(() => {
      playTone(2000, 0.1, 0.3, 'square');
    }, 100);
  };

  const playSound = (type: SoundType) => {
    switch (type) {
      case 'attack':
        playAttackSound();
        break;
      case 'victory':
        playVictorySound();
        break;
      case 'defeat':
        playDefeatSound();
        break;
      case 'impact':
        playImpactSound();
        break;
      case 'critical':
        playCriticalSound();
        break;
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return {
    playSound,
    toggleMute,
    isMuted,
  };
};
