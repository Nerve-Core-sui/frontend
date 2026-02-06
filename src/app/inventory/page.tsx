'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { InventoryItem, ItemDetailModal } from '@/components/inventory';
import { useInventory } from '@/hooks/useInventory';
import { AuthGuard } from '@/components/auth';
import { InventoryItem as InventoryItemType } from '@/types/inventory';
import { RefreshCw } from 'lucide-react';

export default function InventoryPage() {
  const { items, totalValue, tokenCount, positionCount, isLoading, error, refetch } = useInventory();
  const [selectedItem, setSelectedItem] = useState<InventoryItemType | null>(null);

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-5xl font-bold text-white">
              Your Inventory
            </h1>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={refetch}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <RefreshCw className={`w-5 h-5 text-purple-400 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Total Value</div>
              <div className="text-2xl font-bold text-white">
                ${totalValue.toFixed(2)}
              </div>
            </div>
            <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Tokens</div>
              <div className="text-2xl font-bold text-white">
                {tokenCount}
              </div>
            </div>
            <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Positions</div>
              <div className="text-2xl font-bold text-white">
                {positionCount}
              </div>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block text-6xl mb-4"
            >
              ⚔️
            </motion.div>
            <p className="text-slate-400">Loading your treasures...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Your inventory is empty
            </h3>
            <p className="text-slate-400 mb-6">
              Visit the Treasure Vault to claim your first tokens!
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/treasure"
              className="inline-block px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-amber-500/50 transition-shadow"
            >
              Open Treasure Chest
            </motion.a>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <InventoryItem
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </div>
    </AuthGuard>
  );
}
