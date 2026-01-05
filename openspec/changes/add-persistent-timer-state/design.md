# Design: Persistent Timer State

## Context
The Bento Focus app has a Timer page and a Focus Box page, both using the `useTimer` hook independently. When users navigate between pages, the timer resets because React unmounts the component and loses state. Users expect browser-like behavior where background tasks continue running.

## Goals
- Timer state persists when navigating between Timer, Focus Box, Analytics, and Profile pages
- Browser tab title reflects active session for quick visibility
- "New Session" provides a clean start for the next focus session

## Non-Goals
- Persisting timer state across browser refreshes (would require localStorage/server sync)
- Running timers when the app is closed/backgrounded (would require Service Workers)
- Multiple simultaneous timers

## Decisions

### Decision: Use React Context for Timer State
**Why**: React Context is the standard pattern for sharing state across sibling components in the component tree. It's lightweight, doesn't require external dependencies, and works well with the existing hook-based architecture.

**Alternatives considered**:
- **Zustand/Redux**: Overkill for single timer state; adds dependencies
- **URL state**: Timer state is too dynamic (updates every second); would pollute browser history
- **localStorage**: Good for persistence across refreshes, but adds complexity for real-time sync

### Decision: Single Timer Instance
**Why**: The app conceptually supports one active focus session at a time. Having separate timers for Timer page and Focus Box would be confusing (which one is "the" running timer?).

**Implementation**: The TimerProvider wraps the main layout, providing a single timer instance. Both Timer and Focus Box pages consume the same context.

### Decision: Document Title Updates via useEffect
**Why**: `document.title` is a client-side only API. Using `useEffect` in the page components allows dynamic updates based on timer state without server-side rendering issues.

**Format**: `{taskName} - {MM:SS} | Bento Focus`

## Architecture

```
app/(main)/layout.tsx
└── TimerProvider (lib/timer-context.tsx)
    ├── AuthProvider (existing)
    │   ├── Timer Page → uses useTimerContext()
    │   ├── Focus Box Page → uses useTimerContext()
    │   ├── Analytics Page (no timer usage)
    │   └── Profile Page (no timer usage)
    └── BottomNav (existing)
```

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Timer/Focus Box conflict | Add warning modal if user tries to start Timer while Focus Box is running, and vice versa |
| Re-render performance | Timer context only updates once per second; React memo can optimize if needed |
| Ambient sound state | Sound player is already a singleton (`ambientPlayer`); no changes needed |

## Open Questions
- Should completing a timer on one page show completion UI when navigating to the other page? (Suggest: No, only show on the page where it was started)
