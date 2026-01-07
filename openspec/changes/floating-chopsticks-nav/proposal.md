# Proposal: Floating Chopsticks Navigation Menu

## Summary
Replace the current fixed bottom/side navigation with a floating, draggable "chopsticks" menu button. When closed, two vertical chopstick-shaped bars stand vertically. When tapped, they spread apart horizontally like an unfurling scroll, revealing the 4 navigation buttons inside. The entire menu can be dragged around the screen edges but is constrained to stay within the viewport and outside the main content area.

## Motivation
- **Unique Brand Identity**: A bento-themed chopsticks navigation reinforces the "Bento Learn" brand
- **Screen Real Estate**: Removes persistent navigation bars, giving more space to content
- **Customizable Position**: Users can drag the floating menu to their preferred screen location
- **Delightful Interaction**: The scroll-unfurl animation creates a memorable, engaging experience

## Proposed Solution

### Visual States

**Closed State (Default)**
```
    ║║    ← Two thin vertical bars (chopsticks), parallel
```

**Open State (After Tap)**
```
    ╲═══════════════════════════════════╱
     ║  📊   ⏱️   📦   👤  ║
    ╱═══════════════════════════════════╲
    
    Chopsticks rotate 90° outward, scroll appears between them
    with 4 navigation icons (Analytics, Timer, Focus Box, Profile)
```

### Animation Sequence
1. **Tap** the floating chopsticks button
2. Left chopstick rotates **-90°**, moves left
3. Right chopstick rotates **+90°**, moves right
4. Scroll "paper" **scales in** from center between them
5. Navigation icons **fade in** with stagger
6. **Close**: Tap outside, tap again, or select nav item → reverses animation

### Drag Behavior
- Menu can be dragged anywhere within the **viewport edges**
- Uses **smooth spring animation** when dragging
- **Constraint boundary**: Cannot overlap the main content area (configurable safe zones)
- **Magnetic snapping** (optional): Snaps to screen edges when released near them

## Technical Approach

### New Components
1. **`FloatingChopsticksNav`** - Main container with drag logic
2. **`ChopsticksButton`** - The two chopstick bars with open/close animation
3. **`ScrollMenu`** - The unfurling scroll with navigation buttons

### Framer Motion Features Used
- `motion.div` with `drag` prop for draggable behavior
- `dragConstraints` for viewport/area boundaries
- `useDragControls` for custom drag handles
- `useMotionValue` and `useTransform` for coordinated animations
- `AnimatePresence` for scroll reveal
- `variants` for choreographed open/close states

### Integration
- Remove `BottomNav` and `SideNav` from main layout
- Add `FloatingChopsticksNav` as single navigation solution
- Works responsively on all screen sizes

## Scope

### In Scope
- Floating draggable chopsticks button component
- Open/close scroll animation with Framer Motion
- Navigation to all 4 main routes
- Drag constraints within viewport
- Reduced motion support
- Mobile and desktop compatibility

### Out of Scope
- Custom chopstick graphics (using thin rectangular placeholders initially)
- Position persistence across sessions (localStorage)
- Advanced gestures (swipe to open, etc.)
- Sound effects

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Accessibility for drag interaction | Provide tap-to-toggle fallback, keyboard navigation |
| Performance on low-end devices | Test on throttled CPU, simplify animations if needed |
| User confusion (hidden navigation) | Include subtle visual hint/pulse on first visit |

## Success Criteria
- [ ] Chopsticks button renders in closed (vertical) state
- [ ] Tap opens scroll animation smoothly
- [ ] All 4 navigation routes accessible and functional
- [ ] Menu can be dragged within viewport boundaries
- [ ] Animation respects `prefers-reduced-motion`
- [ ] Works on mobile (touch) and desktop (mouse)
