# Tasks for add-framer-motion

## Phase 1: Foundation
- [x] Create `lib/motion.ts` with shared spring configs and variants
- [x] Create `usePrefersReducedMotion` hook for accessibility
- [x] Create `<FadeIn>` component wrapper
- [x] Create `<StaggerContainer>` and child variants
- [x] Create `<TapScale>` wrapper for interactive elements

## Phase 2: Analytics Page Animations
- [x] Add page-level fade-in wrapper to Analytics
- [x] Animate greeting card entry
- [x] Add staggered entry to stats cards (focus score, streak)
- [x] Animate pie chart reveal with rotation
- [x] Add AnimatePresence for tab content switching
- [x] Animate focus score number counting up (Insights tab)
- [x] Add expand/collapse animation for award categories
- [x] Add stagger animation for history items

## Phase 3: Timer Page Animations
- [x] Add TapScale to all control buttons
- [x] Animate timer state transitions (idle → running → complete)
- [x] Add scale pop animation on timer start
- [x] Create completion celebration animation for focus score
- [x] Add AnimatePresence for reset confirmation modal
- [x] Animate duration preset button selection

## Phase 4: Focus Box Page Animations
- [x] Add staggered entry to bento grid task slots
- [x] Add TapScale to task slots and buttons
- [x] Animate drag state with scale and shadow
- [x] Add AnimatePresence for config/running/intermission/complete views
- [x] Create celebration animation for task completion
- [x] Add stagger animation for results cards
- [x] Animate summary stats counting up

## Phase 5: Profile Page Animations
- [x] Animate avatar scale-in on mount
- [x] Add slide-in for user info section
- [x] Add staggered entry for stats grid
- [x] Animate stat values counting up
- [x] Add staggered entry for settings items
- [x] Add layout animation for edit mode toggle

## Phase 6: Navigation Animations
- [x] Add layout animation to bottom nav active indicator
- [x] Add TapScale to nav buttons
- [x] Add subtle page content fade-in on mount

## Verification
- [x] Visual test: Check all animations render correctly in browser
- [x] Performance test: Verify no jank with DevTools Performance tab
- [x] Accessibility test: Verify reduced motion preference is respected
- [x] Cross-browser: Test in Chrome, Firefox, Safari
