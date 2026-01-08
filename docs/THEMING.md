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
