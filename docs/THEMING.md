# Theming Extension Points Documentation

## Overview

The Bento Box Container system includes a foundation for future color theming, where page components can adapt their colors to match the selected bento box design.

## Current Implementation

### BoxThemeContext

The `BoxThemeContext` in `lib/box-theme-context.tsx` provides:

```typescript
interface BoxThemeContextType {
    selectedDesign: BentoBoxDesign;      // Current box design
    allDesigns: BentoBoxDesign[];        // All available designs
    unlockedDesignIds: string[];         // User's unlocked designs
    setSelectedDesign: (id) => void;     // Change selection
    activeColorPalette: ThemeColors | null; // Current color palette
    isLoading: boolean;
    refreshUnlockedDesigns: () => Promise<void>;
}
```

### ThemeColors Interface

Each box design can optionally define a color palette:

```typescript
interface ThemeColors {
    primary: string;    // Main action/accent color
    secondary: string;  // Secondary elements
    accent: string;     // Highlights
    background: string; // Page background
    surface: string;    // Card/container backgrounds
    text: string;       // Primary text color
}
```

## How to Extend

### Adding New Box Designs

1. Create box/lid components in `components/bento-container/`
2. Register in `lib/box-designs.tsx`:

```typescript
{
    id: "my-new-design",
    name: "My Design",
    description: "Description",
    unlockRequirement: { type: "sessions", value: 50, description: "..." },
    BoxComponent: MyBox,
    LidComponent: MyLid,
    previewColor: "#hex",
    colorPalette: { ... } // optional
}
```

### Applying Theme Colors to Components

```tsx
"use client";
import { useBoxTheme } from "@/lib/box-theme-context";

function MyComponent() {
    const { activeColorPalette } = useBoxTheme();
    
    // Use CSS variables or inline styles
    const style = activeColorPalette ? {
        color: activeColorPalette.text,
        backgroundColor: activeColorPalette.surface,
    } : {};
    
    return <div style={style}>...</div>;
}
```

### Future: CSS Variable Injection

A future enhancement could inject theme colors as CSS variables at the root level:

```tsx
// In BoxThemeProvider
useEffect(() => {
    if (activeColorPalette) {
        document.documentElement.style.setProperty('--theme-primary', activeColorPalette.primary);
        // ... etc
    }
}, [activeColorPalette]);
```

Then components would use `var(--theme-primary)` automatically.

## Adding Unlock Requirements

Support three types of unlock conditions:

1. **Sessions**: `{ type: "sessions", value: 25 }` - Total completed sessions
2. **Streak**: `{ type: "streak", value: 7 }` - Max day streak achieved
3. **Award**: `{ type: "award", value: "FOCUS_CHAMPION" }` - Specific award earned

The unlock logic is in `lib/box-designs.tsx`:

```typescript
function isDesignUnlocked(design, userStats, unlockedAwards): boolean {
    // Returns true if user meets the requirement
}
```

## Adding Sound Effects (SFX)

Each box design can optionally define navigation sound effects that play when the lid opens and closes.

### SFX Configuration

Add these optional properties to your box design:

```typescript
{
    id: "my-new-design",
    // ... other properties
    
    // Optional: SFX file paths (relative to public/)
    sfxPaths: {
        open: "/sounds/sfx/my-new-design/open.mp3",
        close: "/sounds/sfx/my-new-design/close.mp3",
    },
    
    // Optional: When to trigger SFX during animations
    sfxTiming: {
        openTrigger: 'start',  // 'start' or 'end' of opening animation
        closeTrigger: 'end',   // 'start' or 'end' of closing animation
    },
}
```

### SFX File Requirements

- **Format**: MP3 (widely supported, good compression)
- **Duration**: 0.2-0.5 seconds recommended for snappy feedback
- **Sample Rate**: 44.1kHz
- **Bitrate**: 128-192 kbps
- **Location**: `public/sounds/sfx/[theme-id]/`

### Velocity-Based SFX Adaptation

The SFX system automatically adapts pitch and volume based on how long the user spent on the page:

| Dwell Time | Category | Pitch Rate | Volume |
|------------|----------|------------|--------|
| < 5 seconds | Quick | 1.3x (higher) | 70% |
| 5-30 seconds | Normal | 1.0x | 100% |
| > 30 seconds | Deep | 0.75x (lower) | 100% |

A micro-pitch jitter (±5%) is applied to each playback for natural variation.

### Adjusting SFX Configuration

Edit `lib/sfx-config.ts` to adjust velocity thresholds and pitch/volume values:

```typescript
export const SFX_CONFIG = {
    VELOCITY_QUICK_THRESHOLD_MS: 5000,   // < 5s = quick
    VELOCITY_DEEP_THRESHOLD_MS: 30000,   // > 30s = deep
    PITCH_QUICK_RATE: 1.3,               // Higher pitch for quick
    PITCH_DEEP_RATE: 0.75,               // Lower pitch for deep
    VOLUME_QUICK: 0.7,                   // Quieter for quick
    JITTER_MIN: 0.95,                    // Micro-pitch jitter range
    JITTER_MAX: 1.05,
};
```

### Using the SFX Player Hook

For custom SFX playback in components:

```tsx
"use client";
import { useSfxPlayer } from "@/lib/use-sfx-player";

function MyComponent() {
    const { playOpenSfx, playCloseSfx, hasSfx, sfxTiming } = useSfxPlayer();
    
    // Play SFX manually with a dwell time (in ms)
    const handleAction = () => {
        if (hasSfx) {
            playOpenSfx(10000); // 10 seconds = normal velocity
        }
    };
    
    return <button onClick={handleAction}>Play Sound</button>;
}
```
