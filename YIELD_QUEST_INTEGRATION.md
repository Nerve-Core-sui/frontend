# Yield Quest Integration Guide

## Overview
The Yield Quest feature allows users to deposit MSUI tokens into a lending pool and earn yield (APY). The implementation includes:

1. **YieldQuest Component** - Modal UI for deposit operations
2. **Yield PTB Builder** - Transaction builders for deposit/withdraw
3. **useYieldQuest Hook** - React hook integrating with battle system

## Files Created

### 1. Transaction Builders (`src/lib/ptb/yield.ts`)
```typescript
- buildDepositTransaction(packageId, poolId, msuiCoinId, clockId)
- buildWithdrawTransaction(packageId, poolId, receiptId)
- estimateEarnings(depositAmount, apyPercent, durationDays)
- formatAPY(apy)
```

### 2. React Hook (`src/hooks/useYieldQuest.ts`)
```typescript
- deposit(msuiCoinId, amount) - Execute deposit with battle animation
- withdraw(receiptId) - Execute withdrawal with battle animation
- isProcessing - Loading state
```

### 3. UI Component (`src/components/quests/YieldQuest.tsx`)
Features:
- Amount input with MAX button
- Current APY display (5% mock)
- Expected earnings calculator (daily/monthly/yearly)
- Vault receipt NFT explanation
- Battle integration for transactions

## Integration Example

### Option 1: Modal Integration
```tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { YieldQuest } from '@/components/quests/YieldQuest';

export default function QuestsPage() {
  const [showYieldQuest, setShowYieldQuest] = useState(false);

  return (
    <>
      <button onClick={() => setShowYieldQuest(true)}>
        Start Yield Quest
      </button>

      <Dialog open={showYieldQuest} onOpenChange={setShowYieldQuest}>
        <DialogContent className="max-w-2xl">
          <YieldQuest
            onClose={() => setShowYieldQuest(false)}
            userMSUIBalance={1000} // Get from wallet
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### Option 2: Direct Page Integration
```tsx
'use client';

import { YieldQuest } from '@/components/quests/YieldQuest';
import { useRouter } from 'next/navigation';

export default function YieldQuestPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <YieldQuest
        onClose={() => router.push('/quests')}
        userMSUIBalance={1000} // Get from wallet
      />
    </div>
  );
}
```

### Option 3: Integration with Quest System
```tsx
'use client';

import { useState } from 'react';
import { YieldQuest } from '@/components/quests/YieldQuest';
import { QuestCard } from '@/components/quests/QuestCard';
import { getQuestById } from '@/lib/quests';

export default function QuestsPage() {
  const [activeQuest, setActiveQuest] = useState<string | null>(null);
  const yieldQuest = getQuestById('yield');

  return (
    <>
      {yieldQuest && (
        <QuestCard
          quest={yieldQuest}
          onClick={() => setActiveQuest('yield')}
        />
      )}

      {activeQuest === 'yield' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <YieldQuest
            onClose={() => setActiveQuest(null)}
            userMSUIBalance={1000}
          />
        </div>
      )}
    </>
  );
}
```

## Battle System Integration

The hook automatically integrates with the battle system:

### Deposit Flow
1. User enters amount and clicks "Start Quest"
2. Battle animation starts (Golem monster, 2 steps)
3. Step 1: Build transaction
4. Step 2: Execute deposit PTB
5. Victory screen shows on success
6. Receipt NFT info displayed

### Battle Steps
```typescript
[
  {
    id: 'build-transaction',
    description: 'Preparing vault deposit transaction...',
  },
  {
    id: 'execute-deposit',
    description: 'Depositing MSUI into the sacred vault...',
  }
]
```

## Receipt Display

After successful deposit, users receive:
- **DepositReceipt NFT** containing:
  - Depositor address
  - Deposit amount
  - Deposit timestamp
  - Borrowed amount (for leverage tracking)

### Viewing Receipts in Inventory
```tsx
// Example: Display receipt info
interface ReceiptData {
  id: string;
  depositAmount: string;
  depositTimestamp: string;
  estimatedEarnings: number;
}

function ReceiptCard({ receipt }: { receipt: ReceiptData }) {
  return (
    <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-gold-500/20 border border-gold-500/30">
      <h3 className="text-lg font-bold text-gold-400 mb-2">
        Vault Receipt #{receipt.id.slice(0, 8)}
      </h3>
      <div className="space-y-1 text-sm">
        <p className="text-gray-300">
          Deposited: <span className="text-gold-400 font-semibold">
            {receipt.depositAmount} MSUI
          </span>
        </p>
        <p className="text-gray-300">
          Earning: <span className="text-green-400 font-semibold">
            +{receipt.estimatedEarnings} MSUI/year
          </span>
        </p>
        <p className="text-gray-400 text-xs">
          Since: {new Date(parseInt(receipt.depositTimestamp)).toLocaleDateString()}
        </p>
      </div>
      <button className="mt-3 w-full py-2 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 font-semibold transition-colors">
        Withdraw
      </button>
    </div>
  );
}
```

## TODO: Connect to Wallet

The current implementation uses mock transaction execution. To connect to a real wallet:

```typescript
// In src/hooks/useYieldQuest.ts, replace the TODO section:

import { useWallet } from '@mysten/wallet-adapter-react';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export function useYieldQuest(): UseYieldQuestReturn {
  const { signAndExecuteTransactionBlock } = useWallet();

  const deposit = useCallback(async (msuiCoinId: string, amount: number) => {
    // ... existing code ...

    try {
      const tx = buildDepositTransaction(
        PACKAGE_ID,
        LENDING_POOL,
        msuiCoinId,
        CLOCK_OBJECT
      );

      // Real wallet execution
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      // Extract receipt ID from created objects
      const receiptObject = result.objectChanges?.find(
        (change) => change.type === 'created' &&
        change.objectType.includes('lending::DepositReceipt')
      );

      return {
        success: true,
        receiptId: receiptObject?.objectId,
        txDigest: result.digest,
      };
    } catch (error) {
      // ... error handling ...
    }
  }, [signAndExecuteTransactionBlock]);
}
```

## Key Features

### 1. APY Display
- Shows current vault APY (5% mock)
- Can be updated to fetch from contract

### 2. Earnings Calculator
- Real-time calculation as user types
- Shows daily, monthly, yearly projections
- Formula: `amount * (apy/100) * (days/365)`

### 3. User Experience
- MAX button for full balance deposit
- Input validation (positive amounts, within balance)
- Disabled state during processing
- Clear error messages

### 4. Gamification
- Battle animation during transaction
- Victory screen on success
- Receipt presented as quest reward
- "Sacred vault" theming

## Testing Checklist

- [ ] Component renders without errors
- [ ] Amount input accepts valid numbers
- [ ] MAX button sets full balance
- [ ] Earnings calculator updates correctly
- [ ] Battle animation triggers on submit
- [ ] Victory screen shows after success
- [ ] Can close modal and return to quests
- [ ] Handles insufficient balance
- [ ] Handles zero/negative amounts
- [ ] Processing state disables buttons

## Architecture Notes

### Why Separate PTB Builders?
- **Reusability**: Can be used in multiple components
- **Testability**: Pure functions easy to test
- **Type Safety**: Clear input/output types
- **Documentation**: Self-documenting transaction structure

### Battle Integration Benefits
- **Consistent UX**: All quests use same battle system
- **Visual Feedback**: Users see progress clearly
- **Error Handling**: Defeat screen for failures
- **Gamification**: Makes DeFi feel like an adventure

### Component Design
- **Self-contained**: All logic in component/hook
- **Flexible**: Works as modal or full page
- **Accessible**: Keyboard navigation, disabled states
- **Responsive**: Works on mobile and desktop

## Next Steps

1. **Connect Wallet**: Replace mock execution with real wallet
2. **Fetch Real APY**: Get current APY from contract
3. **Inventory Integration**: Show receipts in inventory page
4. **Withdraw Flow**: Implement withdrawal with receipt selection
5. **Historical Earnings**: Track and display earning history
6. **Notifications**: Toast notifications for success/error
