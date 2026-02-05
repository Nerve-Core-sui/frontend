'use client';

import { PageTransition } from '@/components/motion';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Box, Coins, Sparkles } from 'lucide-react';

export default function TreasurePage() {
  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Box size={48} className="text-gold-500 animate-pulse" />
          <div>
            <h1 className="text-4xl font-fantasy text-gold-500 text-glow-gold">
              Treasure Chest
            </h1>
            <p className="text-gray-400 mt-2">
              Claim free tokens from the faucet
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card glow className="text-center">
            <CardHeader>
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center mb-6 animate-float shadow-gold-lg">
                <Sparkles size={64} className="text-dark-900" />
              </div>
              <CardTitle className="text-3xl">Open the Treasure Chest</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-400 text-lg">
                Receive free tokens to start your DeFi journey on the Sui Network.
                Perfect for beginners exploring the realm!
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg border border-gold-500/30">
                  <span className="text-gray-300 flex items-center gap-2">
                    <Coins size={20} className="text-gold-500" />
                    SUI Tokens
                  </span>
                  <span className="text-gold-500 font-semibold">100 SUI</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg border border-purple-500/30">
                  <span className="text-gray-300 flex items-center gap-2">
                    <Coins size={20} className="text-purple-500" />
                    USDC Tokens
                  </span>
                  <span className="text-purple-500 font-semibold">1,000 USDC</span>
                </div>
              </div>

              <Button variant="primary" size="lg" glow className="w-full text-lg">
                <Box className="mr-2" size={24} />
                Claim Your Treasure
              </Button>

              <p className="text-sm text-gray-500">
                Faucet available once per day per wallet
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
