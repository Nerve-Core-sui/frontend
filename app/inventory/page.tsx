'use client';

import { PageTransition } from '@/components/motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Package, Coins, TrendingUp, Award } from 'lucide-react';

export default function InventoryPage() {
  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Package size={48} className="text-gold-500" />
          <div>
            <h1 className="text-4xl font-fantasy text-gold-500 text-glow-gold">
              Your Inventory
            </h1>
            <p className="text-gray-400 mt-2">
              View your assets and achievements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center mb-3">
                <Coins size={24} className="text-dark-900" />
              </div>
              <CardTitle className="text-xl">Gold Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-fantasy text-gold-500">0 GOLD</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center mb-3">
                <TrendingUp size={24} className="text-white" />
              </div>
              <CardTitle className="text-xl">Active Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-fantasy text-purple-500">0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center mb-3">
                <Award size={24} className="text-white" />
              </div>
              <CardTitle className="text-xl">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-fantasy text-fantasy-green">0</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Token Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              No tokens found. Complete quests to earn rewards!
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
