'use client';

import { PageTransition, StaggerContainer, StaggerItem } from '@/components/motion';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Sword, Shield, Coins, Zap } from 'lucide-react';

export default function Home() {
  return (
    <PageTransition>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center py-12 space-y-6">
          <h1 className="text-6xl md:text-7xl font-fantasy text-transparent bg-clip-text bg-fantasy-gradient animate-glow">
            Welcome to NerveCore
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Embark on epic quests through the realm of DeFi. Master the arcane arts of
            <span className="text-purple-400 font-semibold"> swapping</span>,
            <span className="text-gold-500 font-semibold"> lending</span>, and
            <span className="text-fantasy-green font-semibold"> yield farming</span> on the Sui Network.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Button variant="primary" size="lg" glow>
              <Sword className="mr-2" size={20} />
              Begin Your Journey
            </Button>
            <Button variant="secondary" size="lg">
              <Shield className="mr-2" size={20} />
              Learn More
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section>
          <h2 className="text-4xl font-fantasy text-gold-500 text-center mb-8 text-glow-gold">
            Choose Your Path
          </h2>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StaggerItem>
              <Card hoverable className="h-full">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center mb-4 shadow-purple animate-float">
                    <Sword size={32} className="text-white" />
                  </div>
                  <CardTitle>Swap Quests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Trade tokens and master the art of market timing. Execute perfect swaps to earn rewards.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card hoverable className="h-full">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center mb-4 shadow-gold animate-float" style={{ animationDelay: '0.5s' }}>
                    <Coins size={32} className="text-dark-900" />
                  </div>
                  <CardTitle>Lending Dungeons</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Deposit your treasures and earn passive income. Manage your lending strategies wisely.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card hoverable className="h-full">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-float" style={{ animationDelay: '1s' }}>
                    <Zap size={32} className="text-white" />
                  </div>
                  <CardTitle>Yield Farms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Cultivate your wealth through liquidity provision. Harvest rewards from your investments.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card hoverable className="h-full">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-float" style={{ animationDelay: '1.5s' }}>
                    <Shield size={32} className="text-white" />
                  </div>
                  <CardTitle>Leverage Battles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Amplify your power with leveraged positions. High risk, high reward combat awaits.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* Stats Section */}
        <section className="py-12">
          <div className="border-gradient">
            <div className="border-gradient-content p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl font-fantasy text-gold-500 mb-2 text-glow-gold">
                    1,234
                  </div>
                  <div className="text-gray-400">Quests Completed</div>
                </div>
                <div>
                  <div className="text-5xl font-fantasy text-purple-500 mb-2 text-glow-purple">
                    567
                  </div>
                  <div className="text-gray-400">Active Warriors</div>
                </div>
                <div>
                  <div className="text-5xl font-fantasy text-fantasy-green mb-2">
                    $2.5M
                  </div>
                  <div className="text-gray-400">Total Treasure Locked</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
