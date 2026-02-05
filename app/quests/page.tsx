'use client';

import { PageTransition } from '@/components/motion';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Scroll, Swords, TrendingUp, Zap } from 'lucide-react';

export default function QuestsPage() {
  const quests = [
    {
      id: 1,
      title: 'First Swap',
      description: 'Execute your first token swap on the DEX',
      difficulty: 'Beginner',
      reward: 100,
      icon: <Swords size={24} />,
      color: 'from-purple-600 to-purple-400',
    },
    {
      id: 2,
      title: 'Lending Master',
      description: 'Deposit tokens and earn lending rewards',
      difficulty: 'Intermediate',
      reward: 250,
      icon: <TrendingUp size={24} />,
      color: 'from-gold-600 to-gold-400',
    },
    {
      id: 3,
      title: 'Yield Farmer',
      description: 'Provide liquidity and claim your first yield',
      difficulty: 'Advanced',
      reward: 500,
      icon: <Zap size={24} />,
      color: 'from-green-600 to-green-400',
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Scroll size={48} className="text-gold-500" />
          <div>
            <h1 className="text-4xl font-fantasy text-gold-500 text-glow-gold">
              Available Quests
            </h1>
            <p className="text-gray-400 mt-2">
              Choose your adventure and earn rewards
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map((quest) => (
            <Card key={quest.id} hoverable>
              <CardHeader>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${quest.color} flex items-center justify-center mb-4 animate-float`}>
                  {quest.icon}
                </div>
                <CardTitle>{quest.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-dark-700 text-purple-400 border border-purple-500/40">
                    {quest.difficulty}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-dark-700 text-gold-500 border border-gold-500/40 flex items-center gap-1">
                    {quest.reward} GOLD
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">{quest.description}</p>
                <Button variant="primary" className="w-full">
                  Start Quest
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
