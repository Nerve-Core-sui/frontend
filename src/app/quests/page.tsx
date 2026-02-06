'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuestCard, QuestDetailModal } from '@/components/quests';
import { TransactionOverlay } from '@/components/transaction';
import { QUESTS, Quest } from '@/lib/quests';
import { AuthGuard } from '@/components/auth';

export default function QuestsPage() {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  return (
    <AuthGuard>
      <div className="py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Quests
          </h1>
          <p className="text-sm text-text-secondary">
            Execute DeFi transactions with ease
          </p>
        </motion.div>

        {/* Quest List */}
        <div className="space-y-3">
          {QUESTS.map((quest, index) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onClick={() => setSelectedQuest(quest)}
              delay={index * 0.05}
            />
          ))}
        </div>

        {/* Quest Detail Modal */}
        <QuestDetailModal
          quest={selectedQuest}
          isOpen={!!selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onStartQuest={(quest, amount, slippage) => {
            console.log('Starting quest:', quest.id, amount, slippage);
            setSelectedQuest(null);
          }}
        />

        {/* Transaction Progress Overlay */}
        <TransactionOverlay />
      </div>
    </AuthGuard>
  );
}
