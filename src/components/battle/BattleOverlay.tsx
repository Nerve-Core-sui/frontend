'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBattle } from '@/hooks/useBattle';
import { useBattleSound } from '@/hooks/useBattleSound';
import { Character } from './Character';
import { HealthBar } from './HealthBar';
import { StepProgress } from './StepProgress';
import { AttackEffect } from './AttackEffect';
import { VictoryScreen } from './VictoryScreen';
import { DefeatScreen } from './DefeatScreen';
import { SoundToggle } from './SoundToggle';
import { Swords, Shield } from 'lucide-react';

export const BattleOverlay: React.FC = () => {
  const { state, endBattle } = useBattle();
  const { playSound, toggleMute, isMuted } = useBattleSound({ enabled: true, volume: 0.3 });
  const [showAttack, setShowAttack] = useState(false);
  const [lastCompletedStep, setLastCompletedStep] = useState(-1);
  const [damageDealt, setDamageDealt] = useState(0);

  // Trigger attack animation when a step completes
  useEffect(() => {
    const completedSteps = state.steps.filter((s) => s.status === 'completed').length;

    if (completedSteps > lastCompletedStep && state.status === 'fighting') {
      const healthPerStep = 100 / state.steps.length;
      const damage = Math.round(healthPerStep);
      setDamageDealt(damage);
      setShowAttack(true);

      // Play attack sound
      playSound('attack');

      // Play critical hit sound for high damage
      if (damage > 30) {
        setTimeout(() => playSound('critical'), 150);
      }

      const timer = setTimeout(() => {
        setShowAttack(false);
      }, 800);

      setLastCompletedStep(completedSteps);

      return () => clearTimeout(timer);
    }
  }, [state.steps, state.status, lastCompletedStep, playSound]);

  // Play victory/defeat sounds
  useEffect(() => {
    if (state.status === 'victory') {
      playSound('victory');
    } else if (state.status === 'defeat') {
      playSound('defeat');
    }
  }, [state.status, playSound]);

  if (!state.isActive) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {state.status === 'victory' && (
        <VictoryScreen
          key="victory"
          questName={state.questName}
          rewards={{
            xp: 150,
            coins: 50,
            items: ['Battle Trophy', 'Experience Boost'],
          }}
          onContinue={endBattle}
        />
      )}

      {state.status === 'defeat' && (
        <DefeatScreen
          key="defeat"
          questName={state.questName}
          errorMessage={state.errorMessage}
          onRetry={() => {
            // TODO: Implement retry logic
            endBattle();
          }}
          onCancel={endBattle}
        />
      )}

      {state.status === 'fighting' && (
        <motion.div
          key="battle"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Sound toggle */}
          <SoundToggle isMuted={isMuted} onToggle={toggleMute} />

          {/* Backdrop with animated pattern */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black/90 to-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Animated grid pattern */}
            <div className="absolute inset-0 bg-dark-pattern opacity-10" />

            {/* Vignette effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)]" />
          </motion.div>

          {/* Battle arena container */}
          <div className="relative z-10 w-full max-w-7xl px-6 py-8">
            {/* Quest title header */}
            <motion.div
              className="text-center mb-8"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Swords className="w-8 h-8 text-gold-500" />
                <h2 className="text-4xl font-fantasy text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                  {state.questName}
                </h2>
                <Shield className="w-8 h-8 text-gold-500" />
              </div>
              <motion.p
                className="text-sm text-gray-400 uppercase tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Transaction in Progress
              </motion.p>
            </motion.div>

            {/* Battle arena */}
            <div className="relative mb-12">
              {/* Battle ground */}
              <motion.div
                className="relative h-[400px] rounded-2xl bg-gradient-to-b from-dark-800/80 to-dark-900/80 border-2 border-gold-500/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {/* Decorative floor */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

                {/* Combat stage */}
                <div className="relative h-full flex items-end justify-between px-16 pb-12">
                  {/* Player side (left) */}
                  <motion.div
                    className="flex flex-col items-center space-y-4"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <Character
                      type="player"
                      isAttacking={showAttack}
                      isVictorious={state.status === 'victory'}
                    />
                    <div className="w-48">
                      <HealthBar current={100} max={100} label="Hero" />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-gray-300 font-semibold uppercase">Ready</span>
                    </div>
                  </motion.div>

                  {/* Center attack effects */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AttackEffect isActive={showAttack} damageAmount={damageDealt} />
                  </div>

                  {/* Monster side (right) */}
                  <motion.div
                    className="flex flex-col items-center space-y-4"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <Character
                      type="monster"
                      monsterType={state.monsterType}
                      isDefeated={state.monsterHealth <= 0}
                    />
                    <div className="w-48">
                      <HealthBar
                        current={state.monsterHealth}
                        max={100}
                        label={state.monsterType.charAt(0).toUpperCase() + state.monsterType.slice(1)}
                        showDamage={showAttack}
                        damageAmount={damageDealt}
                      />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs text-gray-300 font-semibold uppercase">
                        {state.monsterHealth > 0 ? 'Fighting' : 'Defeated'}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Atmospheric particles */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1 h-1 bg-gold-500/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0, 0.6, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                    }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Step progress */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <StepProgress steps={state.steps} currentStep={state.currentStep} />
            </motion.div>

            {/* Battle tips */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-xs text-gray-500 italic">
                Your transaction is being executed on the blockchain...
              </p>
            </motion.div>
          </div>

          {/* Screen shake effect on attack */}
          {showAttack && (
            <motion.div
              className="fixed inset-0 pointer-events-none"
              animate={{ x: [-5, 5, -5, 5, 0], y: [-2, 2, -2, 2, 0] }}
              transition={{ duration: 0.4 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
