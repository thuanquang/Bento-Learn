# Tasks: Persistent Timer State

## 1. Timer Context Infrastructure
- [x] 1.1 Create `lib/timer-context.tsx` with TimerProvider and useTimerContext hook
- [x] 1.2 Move core timer state management (timeRemaining, state, pauseCount, result) to context
- [x] 1.3 Expose timer actions (start, pause, resume, reset, stopEarly) through context

## 2. Layout Integration
- [x] 2.1 Wrap `app/(main)/layout.tsx` with TimerProvider
- [x] 2.2 Ensure AuthProvider and TimerProvider are properly nested

## 3. Timer Page Updates
- [x] 3.1 Refactor `app/(main)/timer/page.tsx` to consume timer from context
- [x] 3.2 Ensure "New Session" button resets timer and clears task name for fresh input
- [x] 3.3 Add `useEffect` to update `document.title` with `[taskName] - [formattedTime] | Bento Focus` when timer is running/paused

## 4. Focus Box Page Updates
- [x] 4.1 Refactor `app/(main)/focus-box/page.tsx` to consume timer from context
- [x] 4.2 Add `useEffect` to update `document.title` with current task and timer when in running state
- [x] 4.3 Ensure Focus Box and Timer don't conflict when both could theoretically be running

## 5. Session Isolation (Optional Safety)
- [x] 5.1 Add logic to prevent Timer and Focus Box from running simultaneously (show warning or auto-pause)
- [x] 5.2 Reset document title to "Bento Focus" when timer is idle or completed

## 6. Testing & Validation
- [x] 6.1 Verify timer continues when navigating Timer → Focus Box → Timer
- [x] 6.2 Verify "New Session" button resets to clean idle state
- [x] 6.3 Verify browser tab shows correct title format during active session
- [x] 6.4 Run `npm run build` to confirm no TypeScript errors
