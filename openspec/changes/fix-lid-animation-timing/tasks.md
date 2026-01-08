# Tasks: Fix Lid Animation Timing

## 1. Update Animation Orchestration
- [x] 1.1 Refactor `BentoBoxContainer.tsx` to use a state machine for animation phases: `idle` → `closing` → `loading` → `opening` → `idle`
- [x] 1.2 Ensure Screen A remains in DOM and visible during the `closing` phase
- [x] 1.3 Transition Screen A out (unmount) only after lid close animation completes
- [x] 1.4 Add content ready detection before transitioning to `opening` phase

## 2. Content Swap Logic
- [x] 2.1 Implement deferred content swap using `AnimatePresence` with `mode="wait"` or manual control
- [x] 2.2 Use `onAnimationComplete` callback on lid close to trigger content swap
- [x] 2.3 Track new content mount status (e.g., via `useEffect` or `onLayoutAnimationComplete`)
- [x] 2.4 Add minimum loading time (e.g., 100ms) to prevent jarring instant transitions

## 3. Loading State
- [x] 3.1 Show loading indicator under closed lid only if content load exceeds 500ms threshold
- [x] 3.2 Ensure loading indicator doesn't flash for fast transitions
- [x] 3.3 Hide loading indicator before lid opens

## 4. Edge Cases
- [x] 4.1 Handle rapid navigation: queue or cancel pending animation if user navigates again mid-transition
- [x] 4.2 Handle navigation during `opening` phase: complete current open, then start new close
- [x] 4.3 Ensure `prefers-reduced-motion` still works (instant swap, no animation)

## 5. Update Spec
- [x] 5.1 Update `bento-container/spec.md` with MODIFIED requirements for Navigation Lid Animation

## 6. Testing
- [x] 6.1 Test transition from Analytics → Timer (verify A stays visible until lid closes)
- [x] 6.2 Test transition to a slow-loading page (verify lid stays closed until ready)
- [x] 6.3 Test rapid navigation (e.g., Analytics → Timer → Profile quickly)
- [x] 6.4 Test reduced motion preference
- [x] 6.5 Run `npm run build` to verify no compilation errors
