# Design: Bento Box Container Architecture

## Context
The Bento Focus app needs a visual container that reinforces the "bento" theme. The container must support:
1. Animated lid transitions during navigation
2. Dynamic content sizing
3. Multiple unlockable box designs
4. Future color theming (components adapt to box style)

### Stakeholders
- Users: Experience delightful transitions and collect unlockable boxes
- Devs: Need clean extension points for new box designs and themes

## Goals / Non-Goals

### Goals
- Create a modular BentoBoxContainer component with swappable designs
- Implement smooth Framer Motion animations for lid open/close/resize
- Establish BoxThemeContext for global box selection and future color theming
- Store user's selected box design in the database
- Integrate with existing awards/progress system for unlocks

### Non-Goals
- Implementing actual color theming in this change (foundation only)
- Creating all final box designs (placeholder + 1-2 unlockables for proof of concept)
- Modifying the navigation component (FloatingChopsticksNav remains unchanged)

## Decisions

### Decision 1: Use Framer Motion Extensively
**What**: All animations MUST be implemented using Framer Motion (already in project at v11.0.8).
**Why**: Framer Motion provides the animation primitives needed for complex sequenced animations, layout transitions, and gesture handling. It's already used throughout the app for consistency.

**Framer Motion features to use**:
- `motion.div` for all animated elements (box, lid, content)
- `AnimatePresence` for enter/exit animations during navigation
- `variants` and `transition` props for coordinated multi-element animations
- `layout` prop for smooth dimension changes
- `useAnimation` hook for imperative control of the 3-phase sequence
- `spring` and `tween` easing for premium feel
- `useReducedMotion` hook for accessibility

### Decision 2: Animation Sequencing
**What**: Use a 3-phase animation sequence: Close Lid → Resize Box → Open Lid
**Why**: This matches the mental model of a physical bento box and creates a satisfying transition that masks content changes during navigation.

**Animation timeline** (orchestrated via Framer Motion `useAnimation`):
1. **Close phase** (300ms): Lid slides over the box from top using `y` transform
2. **Resize phase** (400ms): Box dimensions animate using `layout` prop or explicit `width`/`height`
3. **Open phase** (300ms): Lid slides off with `y` transform and fades via `opacity`

**Alternative considered**: Simultaneous lid + resize animation. Rejected because it feels chaotic and doesn't reinforce the physical bento metaphor.

### Decision 3: Box Design System
**What**: Each box design is a React component implementing a `BentoBoxDesign` interface.
**Why**: Maximum flexibility for varied visual styles (wood, bamboo, lacquered, modern).

```typescript
interface BentoBoxDesign {
  id: string;
  name: string;
  unlockRequirement?: { type: 'award' | 'sessions' | 'streak'; value: string | number };
  BoxComponent: React.FC<BoxProps>;
  LidComponent: React.FC<LidProps>;
  colorPalette?: ThemeColors; // For future theming
}
```

### Decision 4: Theme Context Architecture
**What**: Create `BoxThemeContext` that provides:
- Current selected box design
- List of unlocked box designs
- Method to change box
- Future: Active color palette derived from box design

**Why**: Centralized state allows any component to access theming info, enabling future color adaptation.

### Decision 5: Content Size Measurement
**What**: Use ResizeObserver to measure content dimensions before animation.
**Why**: Pages have varying content heights. We need accurate measurements to animate the box to the correct size.

**Approach**:
- On navigation start, measure current content
- After new content renders (but hidden), measure target size
- Animate between the two sizes during the resize phase

### Decision 6: Database Storage
**What**: Add `selectedBoxDesign` field to UserStats model.
**Why**: Persists user preference across sessions. Re-uses existing UserStats table rather than creating new table.

## Risks / Trade-offs

### Risk 1: Animation Performance
**Risk**: Complex 3-phase animation might lag on lower-end devices.
**Mitigation**: 
- Use `transform` and `opacity` only (GPU-accelerated)
- Implement `prefers-reduced-motion` support
- Keep box/lid as simple SVGs or CSS shapes

### Risk 2: Content Flash
**Risk**: Users might see content flash during lid transitions.
**Mitigation**: 
- Lid fully covers box before content swap
- New content renders while lid is closed
- Use Framer Motion's AnimatePresence for smooth exit/enter

### Risk 3: Scroll Position Loss
**Risk**: Users lose scroll position when navigating back.
**Mitigation**: This is acceptable for now; can add scroll restoration in future iteration if needed.

## Migration Plan

1. **Phase 1**: Implement BentoBoxContainer with default wooden design (no animations)
2. **Phase 2**: Add navigation-triggered lid animations
3. **Phase 3**: Add box design registry and unlock system
4. **Phase 4**: Add Profile section for box selection
5. **No breaking changes**: Existing layout continues to work during incremental rollout

## Open Questions

- Q1: Should the box have a subtle shadow/depth effect, or stay flat?
  - **Recommendation**: Subtle shadow for premium feel
- Q2: What should happen if a user returns to a page mid-animation?
  - **Recommendation**: Complete current animation, then start new one (queue animations)
