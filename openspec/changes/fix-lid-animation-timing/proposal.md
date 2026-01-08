# Proposal: Fix Lid Animation Timing

## Summary
Modify the bento box lid animation sequence to ensure strict ordering: the previous screen remains visible until the lid fully closes, content swap happens only while the lid is closed, and the lid opens only after the new content is completely loaded and ready.

## Why
The current animation implementation doesn't guarantee strict sequencing between the lid animation and content lifecycle. This causes visual glitches where users see content disappear before the lid covers it, or see incomplete content when the lid opens prematurely. The bento box metaphor requires a physical, believable transition where the lid fully conceals the content swap.

## Motivation
The current lid animation implementation may cause visual glitches where:
- The previous screen disappears before the lid finishes closing (content flash)
- The lid opens before the new screen is fully rendered (incomplete content visible)

Users expect a smooth, physical bento box metaphor where:
1. They see the current screen
2. The lid closes over it (hiding the content naturally)
3. Magic happens behind the closed lid (content swap)
4. The lid opens to reveal the new, ready content

## Proposed Changes

### Affected Areas
- `components/bento-container/BentoBoxContainer.tsx` - Animation orchestration logic
- `openspec/specs/bento-container/spec.md` - Updated requirements clarifying the strict timing

### Animation Flow (Strict Sequencing)
```
Screen A visible → Navigation triggered → Lid closes (A still visible underneath)
    → Lid fully closed → Unload Screen A → Load Screen B → B ready signal
    → Lid opens → Screen B visible
```

### Key Implementation Points
1. **Deferred content unload**: Screen A must NOT be removed from DOM until lid close animation completes
2. **Ready signal**: Screen B must signal when it's fully mounted and rendered before lid opens
3. **Loading state**: A loading indicator should appear under the lid only if Screen B takes too long (>500ms)
4. **AnimatePresence coordination**: Use `mode="wait"` or similar to prevent premature exit animations

## Dependencies
- Existing `add-bento-box-container` change (modifies its bento-container spec)
- Framer Motion's animation sequencing capabilities

## Out of Scope
- Changes to navigation logic
- Changes to individual page components
- New box designs or theming
