# Battle Animation System - Integration Guide

## Overview

The Battle Animation System transforms blockchain transaction execution into an epic RPG-style experience. Users see their hero battle monsters with dynamic animations, health bars, attack effects, and victory/defeat screens.

## Quick Start

### 1. Wrap Your App with BattleProvider

```tsx
// app/layout.tsx or _app.tsx
import { BattleProvider } from '@/contexts/BattleContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BattleProvider>
          {children}
          {/* BattleOverlay will show globally when active */}
        </BattleProvider>
      </body>
    </html>
  );
}
```

### 2. Add BattleOverlay to Your Layout

```tsx
// app/layout.tsx or components/Layout.tsx
import { BattleOverlay } from '@/components/battle';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <BattleOverlay />
    </>
  );
}
```

### 3. Use the Battle Hook in Your Components

```tsx
import { useBattle } from '@/hooks/useBattle';
import { BattleStep } from '@/types/battle';

function QuestComponent() {
  const { startBattle, updateStep, setVictory, setDefeat } = useBattle();

  const executeQuest = async () => {
    // Define transaction steps
    const steps: BattleStep[] = [
      {
        id: 'approve',
        description: 'Approving token spend',
        status: 'pending',
      },
      {
        id: 'deposit',
        description: 'Depositing collateral',
        status: 'pending',
      },
      {
        id: 'borrow',
        description: 'Borrowing assets',
        status: 'pending',
      },
      {
        id: 'confirm',
        description: 'Confirming transaction',
        status: 'pending',
      },
    ];

    // Start the battle animation
    startBattle({
      steps,
      monsterType: 'dragon', // 'merchant' | 'golem' | 'dragon'
      questName: 'Leverage Quest',
    });

    try {
      // Execute each step
      for (let i = 0; i < steps.length; i++) {
        updateStep(i, 'in-progress');

        // Execute your actual transaction
        await executeTransactionStep(i);

        updateStep(i, 'completed');
      }

      // Show victory screen
      setVictory();
    } catch (error) {
      // Show defeat screen
      setDefeat(error.message);
    }
  };

  return (
    <button onClick={executeQuest}>
      Start Quest
    </button>
  );
}
```

## API Reference

### BattleContext Methods

#### `startBattle(config)`
Initiates a battle animation.

```ts
startBattle({
  steps: BattleStep[],        // Array of transaction steps
  monsterType: MonsterType,   // 'merchant' | 'golem' | 'dragon'
  questName: string           // Display name for the quest
})
```

#### `updateStep(stepIndex, status)`
Updates the status of a specific step.

```ts
updateStep(
  stepIndex: number,
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
)
```

#### `setVictory(reward?)`
Shows the victory screen with optional rewards.

```ts
setVictory('Epic Loot')
```

#### `setDefeat(error)`
Shows the defeat screen with error message.

```ts
setDefeat('Transaction failed: Insufficient gas')
```

#### `endBattle()`
Closes the battle overlay and resets state.

```ts
endBattle()
```

### BattleStep Interface

```ts
interface BattleStep {
  id: string;                 // Unique identifier
  description: string;        // User-friendly description
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  timestamp?: number;         // Optional timestamp
}
```

### Monster Types

- **merchant**: Easy difficulty, orange theme
- **golem**: Medium difficulty, gray theme
- **dragon**: Hard difficulty, red theme

## Advanced Usage

### Custom Rewards

```tsx
setVictory({
  xp: 150,
  coins: 50,
  items: ['Battle Trophy', 'Experience Boost']
})
```

### Error Handling with Retry

```tsx
const { setDefeat, endBattle } = useBattle();

try {
  // ... transaction execution
} catch (error) {
  setDefeat(error.message);

  // The DefeatScreen component handles retry logic
  // You can access state.status to check for defeat
}
```

### Monitoring Battle State

```tsx
const { state } = useBattle();

// Access battle state
console.log(state.isActive);        // boolean
console.log(state.status);          // 'idle' | 'fighting' | 'victory' | 'defeat'
console.log(state.currentStep);     // number
console.log(state.monsterHealth);   // 0-100
console.log(state.errorMessage);    // string | undefined
```

## Components

### BattleOverlay
Main overlay component that orchestrates the entire battle experience.
- Full-screen dark backdrop
- Battle arena with characters
- Health bars and progress indicators
- Attack animations and effects

### Character
Renders hero or monster characters with SVG silhouettes.
- Supports player and monster types
- Different styles for each monster type
- Attack, victory, and defeat animations

### HealthBar
Animated health bar with damage effects.
- Color-coded by health level (green → yellow → red)
- Floating damage numbers
- Smooth transitions

### StepProgress
Visual progress indicator for multi-step transactions.
- Shows all steps with status icons
- Highlights current step
- Animated progress line

### AttackEffect
Epic attack animations in the center of the arena.
- Slash effects
- Impact flash
- Damage numbers
- Particle effects
- Critical hit stars

### VictoryScreen
Celebratory screen shown on success.
- Confetti animation
- Trophy display
- Rewards breakdown
- Continue button

### DefeatScreen
Error screen shown on failure.
- Dark theme with red accents
- Error message display
- Retry and cancel options

## Styling Customization

The system uses Tailwind CSS with custom colors defined in `tailwind.config.ts`:

```js
colors: {
  dark: { 900, 800, 700, 600 },
  gold: { 500, 600, 400 },
  purple: { 500, 600, 400 },
  fantasy: { red, green, amber }
}
```

To customize colors, update your Tailwind config or override component classes.

## Performance Considerations

- Uses Framer Motion for smooth animations
- Efficient re-renders with proper React memoization
- Minimal bundle impact (~50KB gzipped including animations)
- GPU-accelerated transforms for 60fps animations

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Demo

Visit `/battle-demo` to see the system in action with a simulated battle.

## Troubleshooting

### Battle doesn't appear
- Ensure `BattleProvider` wraps your app
- Verify `BattleOverlay` is rendered in your layout
- Check that `startBattle()` is being called

### Animations are janky
- Reduce number of particles in `BattleOverlay`
- Check for performance issues with DevTools
- Ensure GPU acceleration is enabled

### Steps not updating
- Verify you're calling `updateStep()` with correct index
- Check that step IDs are unique
- Console log `state.steps` to debug

## License

MIT
