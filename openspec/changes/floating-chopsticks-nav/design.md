# Design: Floating Chopsticks Navigation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  FloatingChopsticksNav (Draggable Container)                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ChopsticksButton                                     │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ Left Stick │ ScrollMenu (AnimatePresence) │Right│ │  │
│  │  │   ║        │    📊  ⏱️  📦  👤             │  ║  │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
FloatingChopsticksNav
├── motion.div (draggable container)
│   └── ChopsticksButton
│       ├── motion.div (left chopstick)
│       ├── AnimatePresence
│       │   └── ScrollMenu (when open)
│       │       └── NavItem × 4
│       └── motion.div (right chopstick)
```

## State Management

### Local State
```typescript
interface ChopsticksState {
  isOpen: boolean;          // Menu expanded or collapsed
  position: { x: number; y: number };  // Current drag position
  isDragging: boolean;      // Currently being dragged
}
```

### Position Constraints
```typescript
interface DragConstraints {
  top: number;
  left: number;
  right: number;
  bottom: number;
}
```

## Animation Specifications

### Chopstick Rotation (Open)
```typescript
// Left chopstick
const leftStickOpen = {
  rotate: -90,
  x: -scrollWidth / 2,
  transition: { type: "spring", stiffness: 300, damping: 25 }
};

// Right chopstick
const rightStickOpen = {
  rotate: 90,
  x: scrollWidth / 2,
  transition: { type: "spring", stiffness: 300, damping: 25 }
};
```

### Scroll Unfurl
```typescript
const scrollVariants = {
  hidden: {
    scaleX: 0,
    opacity: 0,
  },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 30,
      delay: 0.1  // After chopsticks start moving
    }
  },
  exit: {
    scaleX: 0,
    opacity: 0,
    transition: { duration: 0.15 }
  }
};
```

### Nav Items Stagger
```typescript
const navItemsContainer = {
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15
    }
  }
};

const navItem = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  }
};
```

## Drag Constraints Logic

```typescript
function useDragConstraints(menuRef: RefObject<HTMLElement>) {
  const [constraints, setConstraints] = useState<DragConstraints>({
    top: 20,
    left: 20,
    right: window.innerWidth - 20 - MENU_WIDTH,
    bottom: window.innerHeight - 20 - MENU_HEIGHT
  });

  useEffect(() => {
    const updateConstraints = () => {
      setConstraints({
        top: 20,
        left: 20,
        right: window.innerWidth - 20 - MENU_WIDTH,
        bottom: window.innerHeight - 20 - MENU_HEIGHT
      });
    };
    
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  return constraints;
}
```

## Styling Strategy

### CSS Variables
```css
:root {
  --chopstick-width: 8px;
  --chopstick-height: 60px;
  --chopstick-color: #8B7355;  /* Warm brown */
  --chopstick-radius: 4px;
  
  --scroll-bg: rgba(255, 250, 240, 0.95);
  --scroll-border: rgba(139, 115, 85, 0.3);
  --scroll-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  --nav-item-size: 44px;
  --nav-item-gap: 8px;
}
```

### Chopstick Placeholder (Thin Block)
```css
.chopstick {
  width: var(--chopstick-width);
  height: var(--chopstick-height);
  background: var(--chopstick-color);
  border-radius: var(--chopstick-radius);
  transform-origin: center center;
}
```

## Accessibility Considerations

1. **Keyboard Navigation**
   - `Tab` to focus the chopsticks button
   - `Enter/Space` to toggle open/close
   - Arrow keys to navigate menu items when open
   - `Escape` to close menu

2. **Screen Reader**
   - `role="navigation"` on container
   - `aria-expanded` on button
   - `aria-label="Main navigation menu"`
   - Announce state changes

3. **Reduced Motion**
   - Skip rotation/scale animations
   - Instant state changes
   - Maintain drag functionality

## File Structure

```
components/
└── navigation/
    ├── floating-chopsticks-nav.tsx      # Main container
    ├── floating-chopsticks-nav.module.css
    ├── chopsticks-button.tsx            # Animated button
    └── scroll-menu.tsx                  # Expanded menu content
```

## Edge Cases

1. **Menu Opens Near Edge**: If menu would overflow viewport when opened, animate constraint correction
2. **Orientation Change**: Recalculate constraints on viewport resize
3. **Rapid Toggle**: Debounce or use `AnimatePresence` mode="wait"
4. **Touch vs Mouse**: Handle `onDragStart` differently for touch precision
