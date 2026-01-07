# Tasks: Floating Chopsticks Navigation

## Phase 1: Core Component Structure

- [ ] **1.1** Create `components/navigation/floating-chopsticks-nav.module.css` with CSS variables and base styles for chopsticks, scroll container, and nav items
- [ ] **1.2** Create `components/navigation/floating-chopsticks-nav.tsx` - main draggable container with Framer Motion `drag` prop
- [ ] **1.3** Implement closed state: two vertical chopstick bars (thin rectangular divs)
- [ ] **1.4** Add tap handler to toggle `isOpen` state

## Phase 2: Open/Close Animation

- [ ] **2.1** Animate left chopstick: rotate -90° and translate left on open
- [ ] **2.2** Animate right chopstick: rotate +90° and translate right on open
- [ ] **2.3** Add scroll "paper" element that scales in from center using `AnimatePresence`
- [ ] **2.4** Implement staggered fade-in for 4 navigation icons inside scroll
- [ ] **2.5** Add close animation (reverse of open sequence)

## Phase 3: Navigation Functionality

- [ ] **3.1** Add navigation items with icons (Analytics, Timer, Focus Box, Profile)
- [ ] **3.2** Wire up `next/link` for each nav item
- [ ] **3.3** Highlight active route with visual indicator
- [ ] **3.4** Close menu after navigation selection

## Phase 4: Drag Behavior

- [ ] **4.1** Implement `useDragConstraints` hook for viewport boundaries
- [ ] **4.2** Add drag constraints to prevent menu from leaving viewport
- [ ] **4.3** Handle viewport resize to recalculate constraints
- [ ] **4.4** Add spring animation when drag ends (elastic snap)

## Phase 5: Integration & Cleanup

- [ ] **5.1** Remove `SideNav` and `BottomNav` from main layout
- [ ] **5.2** Add `FloatingChopsticksNav` to main layout
- [ ] **5.3** Update `layout.module.css` to remove sidebar/bottom nav margins
- [ ] **5.4** Test on mobile viewport (touch drag)
- [ ] **5.5** Test on desktop viewport (mouse drag)

## Phase 6: Accessibility & Polish

- [ ] **6.1** Add `usePrefersReducedMotion` hook integration - skip animations
- [ ] **6.2** Add keyboard navigation support (Tab, Enter, Escape)
- [ ] **6.3** Add ARIA attributes (role, aria-expanded, aria-label)
- [ ] **6.4** Verify focus management when menu opens/closes

## Validation

- [ ] **V1** Run `npm run build` to verify no TypeScript/build errors
- [ ] **V2** Manual test: menu opens/closes with animation
- [ ] **V3** Manual test: can drag menu around screen
- [ ] **V4** Manual test: all 4 navigation routes work
- [ ] **V5** Manual test: reduced motion preference disables animations
