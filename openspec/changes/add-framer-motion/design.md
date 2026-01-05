# Framer Motion Animation Design

## Animation Philosophy
Animations should feel **natural, purposeful, and delightful** without being distracting. We follow iOS/Apple design principles:
- Smooth spring animations for interactive elements
- Staggered reveals for lists and grids
- Subtle scale feedback on taps
- Coherent motion language across the app

## Animation Patterns

### 1. Spring Configuration (Shared)
```ts
// lib/motion.ts
export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export const gentleSpring = {
  type: "spring", 
  stiffness: 200,
  damping: 25
};
```

### 2. Entry Animations
**Page Fade-In**: Content fades and slides up on mount
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
/>
```

**Staggered List**: Children animate in sequence
```tsx
<motion.div variants={containerVariants}>
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants} />
  ))}
</motion.div>
```

### 3. Interactive Feedback
**Tap Scale**: iOS-style press feedback
```tsx
<motion.button whileTap={{ scale: 0.97 }} />
```

**Hover Lift**: Subtle elevation on hover (desktop)
```tsx
<motion.div whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }} />
```

### 4. State Transitions
**AnimatePresence**: Smooth enter/exit for conditional content
```tsx
<AnimatePresence mode="wait">
  {activeTab === "overview" && <OverviewTab key="overview" />}
</AnimatePresence>
```

### 5. Number Counting
**Animated Counter**: Numbers count up on reveal
```tsx
<motion.span>{Math.round(animatedValue)}</motion.span>
// Using useSpring or animate()
```

## Per-Page Animation Map

### Analytics Page
| Element | Animation | Trigger |
|---------|-----------|---------|
| Greeting card | Fade + slide up | Mount |
| Stats cards | Stagger from left | Mount |
| Pie chart | Rotate reveal | Mount |
| Tab content | Fade switch | Tab change |
| Focus score | Count up | Mount |
| Award cards | Expand on click | Click |
| History items | Slide in | Mount |

### Timer Page
| Element | Animation | Trigger |
|---------|-----------|---------|
| Timer ring | Pulse when active | Timer start |
| Time display | Scale pop on start | State change |
| Duration buttons | Scale on tap | Tap |
| Main button | Spring scale | Tap |
| Completion score | Bounce reveal | Complete |
| Modal | Fade + scale | Open/close |

### Focus Box Page
| Element | Animation | Trigger |
|---------|-----------|---------|
| Bento grid | Perspective tilt on drag | Drag |
| Task slots | Spring scale on tap | Tap |
| Start button | Pulse when ready | All tasks filled |
| Progress dots | Pop in sequence | Task complete |
| Intermission | Celebration burst | Task complete |
| Results cards | Stagger in | Complete |

### Profile Page
| Element | Animation | Trigger |
|---------|-----------|---------|
| Avatar | Scale + fade in | Mount |
| User info | Slide from right | Mount |
| Stats grid | Stagger count up | Mount |
| Settings items | Slide in | Mount |
| Edit mode | Expand animation | Toggle |

### Navigation
| Element | Animation | Trigger |
|---------|-----------|---------|
| Active indicator | Layout animation | Tab change |
| Page wrapper | Fade between pages | Navigation |

## Accessibility: Reduced Motion
All animations respect `prefers-reduced-motion`:
```tsx
const prefersReducedMotion = usePrefersReducedMotion();
const animation = prefersReducedMotion ? {} : fadeIn;
```

## File Structure
```
lib/
  motion.ts          # Shared variants, transitions, hooks
components/
  motion/
    AnimatedCounter.tsx
    FadeIn.tsx
    StaggerContainer.tsx
    TapScale.tsx
```
