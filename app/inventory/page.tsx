'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Package, Coins, TrendingUp, Sparkles, Box } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { InventoryItem as InventoryItemComponent } from '@/components/inventory';
import { ItemDetailModal } from '@/components/inventory';
import { InventoryItem as InventoryItemType } from '@/types/inventory';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function InventoryPage() {
  const { isAuthenticated } = useAuth();
  const { items, totalValue, tokenCount, positionCount, isLoading } = useInventory();
  const [selectedItem, setSelectedItem] = useState<InventoryItemType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (item: InventoryItemType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleWithdraw = (itemId: string) => {
    console.log('Withdraw position:', itemId);
    // TODO: Implement withdraw logic
    setIsModalOpen(false);
  };

  const handleTransfer = (itemId: string) => {
    console.log('Transfer token:', itemId);
    // TODO: Implement transfer logic
    setIsModalOpen(false);
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-gold-lg">
            <Package size={32} className="text-dark-900" />
          </div>
          <div>
            <h1 className="text-5xl font-fantasy text-gold-500 text-glow-gold tracking-wide">
              Inventory
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Your legendary collection of assets and equipment
            </p>
          </div>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card glow className="border-gold-500/50">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center mb-3 shadow-gold">
                  <Sparkles size={28} className="text-dark-900" />
                </div>
                <CardTitle className="text-xl">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-fantasy text-gold-500 text-glow-gold">
                  ${totalValue.toFixed(2)}
                </div>
                <p className="text-sm text-gray-500 mt-2">USD Equivalent</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card hoverable>
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center mb-3">
                  <Coins size={28} className="text-white" />
                </div>
                <CardTitle className="text-xl">Token Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-fantasy text-purple-400">
                  {tokenCount}
                </div>
                <p className="text-sm text-gray-500 mt-2">Different tokens</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card hoverable>
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center mb-3">
                  <TrendingUp size={28} className="text-white" />
                </div>
                <CardTitle className="text-xl">Active Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-fantasy text-green-400">
                  {positionCount}
                </div>
                <p className="text-sm text-gray-500 mt-2">Earning yield</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Inventory grid */}
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="text-center py-20">
              <CardContent>
                <Package size={80} className="mx-auto text-gray-600 mb-6" />
                <h2 className="text-3xl font-fantasy text-gray-400 mb-4">
                  Connect Your Wallet
                </h2>
                <p className="text-gray-500 text-lg">
                  Connect your wallet to view your inventory
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-block w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-gray-400 text-lg font-fantasy">
              Loading your inventory...
            </p>
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="text-center py-20 border-gold-500/30">
              <CardContent>
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Box size={80} className="mx-auto text-gray-600 mb-6" />
                </motion.div>
                <h2 className="text-3xl font-fantasy text-gray-400 mb-4">
                  Your Inventory is Empty
                </h2>
                <p className="text-gray-500 text-lg mb-8">
                  Visit the Treasure Chest to claim free tokens and start your adventure!
                </p>
                <Link href="/treasure">
                  <button className="btn-fantasy px-8 py-4 text-lg inline-flex items-center gap-3">
                    <Sparkles size={24} />
                    Visit Treasure Chest
                  </button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-fantasy text-gold-500 mb-2">
                Items ({items.length})
              </h2>
              <p className="text-gray-400">
                Click on any item to view details and manage
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <InventoryItemComponent item={item} onClick={() => handleItemClick(item)} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Item detail modal */}
      <ItemDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        onWithdraw={handleWithdraw}
        onTransfer={handleTransfer}
      />
    </PageTransition>
  );
}
