# Change: Add Persistent Timer State Across Navigation

## Why
Currently, navigating away from the Timer or Focus Box page causes the timer to reset because the `useTimer` hook state is tied to the component lifecycle. Users expect the timer to continue running in the background when switching between sections. Additionally, the "New Session" button on the completed state doesn't provide a clear workflow reset, and there's no visual indicator in the browser tab showing the current session and timer.

## What Changes
- **Background Timer Persistence**: Lift timer state to a React Context so it persists across navigation between Timer and Focus Box pages
- **New Session Button**: Ensure the "New Session" button properly resets the timer to idle state with cleared configuration ready for a fresh session
- **Dynamic Tab Title**: Update the browser tab title to show `[Session Name] - [MM:SS] | Bento Focus` format when a timer is running

## Impact
- Affected specs: timer-state (new capability)
- Affected code:
  - `lib/use-timer.ts` → Refactor to support context-based state management
  - `lib/timer-context.tsx` → New context provider for shared timer state
  - `app/(main)/layout.tsx` → Wrap with TimerProvider
  - `app/(main)/timer/page.tsx` → Consume timer from context, add document title effect
  - `app/(main)/focus-box/page.tsx` → Consume timer from context, add document title effect
