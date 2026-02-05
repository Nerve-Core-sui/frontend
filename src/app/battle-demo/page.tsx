'use client';

import React, { useState } from 'react';
import { BattleProvider } from '@/contexts/BattleContext';
import { useBattle } from '@/hooks/useBattle';
import { BattleOverlay } from '@/components/battle';
import { BattleStep, MonsterType } from '@/types/battle';
import { Swords, Sparkles, Trophy } from 'lucide-react';

// Demo component inside provider
const BattleDemoContent: React.FC = () => {
  const { startBattle, updateStep, setVictory, setDefeat, state } = useBattle();
  const [selectedMonster, setSelectedMonster] = useState<MonsterType>('merchant');

  const simulateBattle = async (monster: MonsterType) => {
    // Create battle steps (simulating a multi-step transaction)
    const steps: BattleStep[] = [
      {
        id: 'step-1',
        description: 'Preparing attack strategy',
        status: 'pending',
      },
      {
        id: 'step-2',
        description: 'Executing primary strike',
        status: 'pending',
      },
      {
        id: 'step-3',
        description: 'Deploying special ability',
        status: 'pending',
      },
      {
        id: 'step-4',
        description: 'Finishing move',
        status: 'pending',
      },
    ];

    // Start the battle
    startBattle({
      steps,
      monsterType: monster,
      questName: `Defeat the ${monster.charAt(0).toUpperCase() + monster.slice(1)}`,
    });

    // Simulate step-by-step execution
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Randomly fail on step 3 for demonstration (10% chance)
      if (i === 2 && Math.random() < 0.1) {
        updateStep(i, 'failed');
        await new Promise((resolve) => setTimeout(resolve, 500));
        setDefeat('Transaction failed: Insufficient mana for special ability');
        return;
      }

      updateStep(i, 'in-progress');
      await new Promise((resolve) => setTimeout(resolve, 800));
      updateStep(i, 'completed');
    }

    // Victory!
    await new Promise((resolve) => setTimeout(resolve, 500));
    setVictory();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 bg-dark-pattern">
      {/* Battle Overlay */}
      <BattleOverlay />

      {/* Demo Controls */}
      {!state.isActive && (
        <div className="container mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Swords className="w-12 h-12 text-gold-500" />
              <h1 className="text-6xl font-fantasy text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600">
                Battle System Demo
              </h1>
              <Trophy className="w-12 h-12 text-gold-500" />
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience epic RPG-style animations while your blockchain transactions execute.
              Choose your opponent and witness the battle unfold!
            </p>
          </div>

          {/* Monster selection */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-fantasy text-gold-400 text-center mb-6 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              Select Your Opponent
              <Sparkles className="w-6 h-6" />
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Merchant */}
              <button
                onClick={() => setSelectedMonster('merchant')}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedMonster === 'merchant'
                    ? 'border-gold-500 bg-gold-500/10 shadow-gold'
                    : 'border-gray-700 bg-dark-800/50 hover:border-gold-500/50 hover:bg-gold-500/5'
                }`}
              >
                <div className="absolute -top-3 -right-3">
                  {selectedMonster === 'merchant' && (
                    <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center animate-pulse">
                      <span className="text-dark-900 text-xl">✓</span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-b from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <span className="text-5xl">🧙</span>
                  </div>
                  <h3 className="text-xl font-bold text-gold-400 mb-2">Merchant</h3>
                  <p className="text-sm text-gray-400 mb-3">A cunning trader with tricks up his sleeve</p>
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">Easy</span>
                    <span className="text-gray-500">4 Attacks</span>
                  </div>
                </div>
              </button>

              {/* Golem */}
              <button
                onClick={() => setSelectedMonster('golem')}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedMonster === 'golem'
                    ? 'border-gold-500 bg-gold-500/10 shadow-gold'
                    : 'border-gray-700 bg-dark-800/50 hover:border-gold-500/50 hover:bg-gold-500/5'
                }`}
              >
                <div className="absolute -top-3 -right-3">
                  {selectedMonster === 'golem' && (
                    <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center animate-pulse">
                      <span className="text-dark-900 text-xl">✓</span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-b from-gray-500 to-gray-700 flex items-center justify-center shadow-lg">
                    <span className="text-5xl">🗿</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-400 mb-2">Stone Golem</h3>
                  <p className="text-sm text-gray-400 mb-3">A massive construct of ancient stone</p>
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">Medium</span>
                    <span className="text-gray-500">4 Attacks</span>
                  </div>
                </div>
              </button>

              {/* Dragon */}
              <button
                onClick={() => setSelectedMonster('dragon')}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedMonster === 'dragon'
                    ? 'border-gold-500 bg-gold-500/10 shadow-gold'
                    : 'border-gray-700 bg-dark-800/50 hover:border-gold-500/50 hover:bg-gold-500/5'
                }`}
              >
                <div className="absolute -top-3 -right-3">
                  {selectedMonster === 'dragon' && (
                    <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center animate-pulse">
                      <span className="text-dark-900 text-xl">✓</span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-b from-red-500 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/50">
                    <span className="text-5xl">🐉</span>
                  </div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">Elder Dragon</h3>
                  <p className="text-sm text-gray-400 mb-3">A legendary beast of fire and fury</p>
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400">Hard</span>
                    <span className="text-gray-500">4 Attacks</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Start battle button */}
          <div className="text-center">
            <button
              onClick={() => simulateBattle(selectedMonster)}
              className="group relative inline-flex items-center gap-3 px-12 py-6 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 font-bold text-2xl uppercase tracking-wider shadow-gold-lg transition-all duration-300 hover:scale-105 hover:shadow-gold-lg active:scale-95"
            >
              <Swords className="w-8 h-8 group-hover:rotate-12 transition-transform" />
              Start Battle
              <Swords className="w-8 h-8 group-hover:-rotate-12 transition-transform" />

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>

            <p className="mt-4 text-sm text-gray-500">
              Simulates a 4-step transaction with ~90% success rate
            </p>
          </div>

          {/* Features showcase */}
          <div className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '⚔️',
                title: 'Dynamic Attacks',
                description: 'Each transaction step triggers epic attack animations',
              },
              {
                icon: '❤️',
                title: 'Health Tracking',
                description: 'Monster health depletes with each completed step',
              },
              {
                icon: '✨',
                title: 'Visual Effects',
                description: 'Slashes, impacts, damage numbers, and particles',
              },
              {
                icon: '🎯',
                title: 'Step Progress',
                description: 'Clear visualization of multi-step transaction flow',
              },
              {
                icon: '🏆',
                title: 'Victory Screen',
                description: 'Celebrate success with rewards and confetti',
              },
              {
                icon: '💀',
                title: 'Defeat Handling',
                description: 'Graceful error display with retry options',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-dark-800/50 border border-gray-700 hover:border-gold-500/50 transition-colors"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gold-400 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main page component with provider
export default function BattleDemoPage() {
  return (
    <BattleProvider>
      <BattleDemoContent />
    </BattleProvider>
  );
}
