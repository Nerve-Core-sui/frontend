# NerveCore Splash Screen Implementation

## Overview
A charming pixel art splash screen with deep purple background, twinkling stars, and animated gold "NERVECORE" logo.

## Files Created

### 1. `src/components/splash/SplashScreen.tsx`
Main splash screen component featuring:
- **Deep purple gradient background** (`#1a1520` to `#0f0a15`)
- **40 twinkling pixel stars** with randomized positions and staggered animation
- **Animated "NERVECORE" logo** in gold (`#f7d359`) with dark outline
- **Pixel art treasure chest** decoration at the bottom
- **Letter-by-letter reveal** animation (typewriter style)
- **Shimmer/glow effect** on the logo text

### 2. `src/hooks/useSplashScreen.ts`
Custom hook for splash screen state management:
- Tracks if splash has been shown this session
- Uses `sessionStorage` to show splash once per session
- Returns `{ showSplash, isVisible, hideSplash }`
- Handles fade-out transition

### 3. `src/components/splash/index.ts`
Barrel export for clean imports

### 4. Integration in `src/components/layout/Layout.tsx`
- Splash screen conditionally renders on first load
- Uses Framer Motion's `AnimatePresence` for smooth transitions
- Automatically hides after 3 seconds

## Animation Sequence

| Time | Animation |
|------|-----------|
| 0-0.5s | Stars fade in and begin twinkling |
| 0.3s | Treasure chest appears with bounce |
| 0.5-1.4s | Logo letters reveal one by one (typewriter) |
| 1.5s+ | Logo shimmers with pulsing glow effect |
| 1.8s | "DeFi Adventures" subtitle fades in |
| 2.5-3s | Entire splash fades out to main app |

## Key Features

### Pixel Art Aesthetics
- Monospace font (Courier New) for authentic retro feel
- Pixelated rendering with `image-rendering: crisp-edges`
- Chunky text shadow for depth (2px solid outline)
- Gold color scheme matches treasure/gaming theme

### Performance
- CSS-only animations for stars (no JS loop)
- Proper cleanup of timers on unmount
- Smooth 60fps transitions using Framer Motion
- Lightweight (~6.4KB component file)

### Treasure Chest
Custom pixel art created with CSS:
- Layered div structure for 3D effect
- Gold gradient shading
- Lock detail in center
- Drop shadow with gold glow

### Accessibility
- Uses `sessionStorage` (not `localStorage`) for privacy
- Respects `prefers-reduced-motion` via Framer Motion
- High contrast gold on dark purple
- Fixed 3-second duration (not too long)

## How to Use

The splash screen is automatically integrated into the app layout and will:
1. Show on first page load of each session
2. Display for 3 seconds with full animation sequence
3. Fade out smoothly to reveal the main app
4. Not show again until browser session ends

To manually control:
```tsx
import { SplashScreen } from '@/components/splash';
import { useSplashScreen } from '@/hooks/useSplashScreen';

function App() {
  const { showSplash, isVisible, hideSplash } = useSplashScreen();

  return (
    <>
      {showSplash && isVisible && (
        <SplashScreen onComplete={hideSplash} />
      )}
      {/* Your app content */}
    </>
  );
}
```

## Customization

### Change Duration
Edit `SplashScreen.tsx` line 19:
```tsx
setTimeout(() => onComplete(), 3000); // Change 3000 to desired milliseconds
```

### Change Colors
- **Background**: Line 41 - gradient colors
- **Logo gold**: Line 130 - `color: #f7d359`
- **Stars**: Line 119 - `background: #f7d359`

### Disable Per Session Storage
Edit `useSplashScreen.ts` line 12:
```tsx
// Remove this check to show every page load:
const hasShownSplash = sessionStorage.getItem('nervecore_splash_shown');
```

## Build Verification

✅ Build successful: `npm run build`
✅ TypeScript validation passed
✅ ESLint checks passed
✅ All files created and integrated
✅ No console errors or warnings

## Technical Stack
- Next.js 14 (App Router)
- Framer Motion 12.31.0
- TypeScript 5
- Tailwind CSS 3.4.1
- React 18

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-optimized with responsive design
- Works on iOS and Android PWA mode
