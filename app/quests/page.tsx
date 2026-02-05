'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Scroll, Sword } from 'lucide-react';
import { PageTransition } from '@/components/motion';
import { QuestCard } from '@/components/quests/QuestCard';
import { QuestDetailModal } from '@/components/quests/QuestDetailModal';
import { QUESTS, Quest } from '@/lib/quests';
import { useBattleContext } from '@/contexts/BattleContext';
import { BattleStep, MonsterType } from '@/types/battle';

export default function QuestsPage() {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { startBattle } = useBattleContext();

  const handleQuestClick = (quest: Quest) => {
    setSelectedQuest(quest);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedQuest(null), 300);
  };

  const handleStartQuest = (quest: Quest, amount: string, slippage: number) => {
    // Map quest steps to battle steps
    const battleSteps: BattleStep[] = quest.steps.map((step, index) => ({
      id: `${quest.id}-step-${index}`,
      description: step.description,
      status: 'pending' as const,
    }));

    // Determine monster type based on quest difficulty and risk
    let monsterType: MonsterType = 'merchant';
    if (quest.difficulty === 'advanced' || quest.risk === 'high') {
      monsterType = 'dragon';
    } else if (quest.difficulty === 'intermediate' || quest.risk === 'medium') {
      monsterType = 'golem';
    }

    // Start the battle with quest configuration
    startBattle({
      steps: battleSteps,
      monsterType,
      questName: quest.title,
    });

    console.log('Quest started:', {
      quest: quest.id,
      amount,
      slippage,
      monsterType,
    });
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Scroll size={56} className="text-gold-500 drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]" />
            </motion.div>
          </div>

          <h1 className={clsx(
            'text-5xl md:text-6xl font-fantasy text-center mb-4',
            'bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400',
            'bg-clip-text text-transparent',
            'drop-shadow-[0_4px_20px_rgba(255,215,0,0.6)]'
          )}>
            Quest Board
          </h1>

          <p className="text-center text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Choose your destiny, brave adventurer. Each quest offers glory, rewards, and the chance to prove your worth in the realm of decentralized finance.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
            <Sword size={20} className="text-gold-500" />
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
          </div>
        </motion.div>

        {/* Filter hint - Optional for future expansion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center justify-center gap-3 text-sm text-gray-400"
        >
          <span>Showing all quests</span>
          <span className="text-gold-500/50">•</span>
          <span>{QUESTS.length} available</span>
        </motion.div>

        {/* Quest Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8"
        >
          {QUESTS.map((quest, index) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onClick={() => handleQuestClick(quest)}
              delay={0.5 + index * 0.1}
            />
          ))}
        </motion.div>

        {/* Quest Detail Modal */}
        <QuestDetailModal
          quest={selectedQuest}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onStartQuest={handleStartQuest}
        />
      </div>
    </PageTransition>
  );
}
