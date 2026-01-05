# Add Beautiful Framer Motion Animations

## Summary
Enhance the Bento Learn app with creative, polished Framer Motion animations across all pages to create a delightful, iOS-inspired user experience with fluid interactions, smooth page transitions, and engaging micro-interactions.

## Motivation
- Framer Motion v11.0.8 is already installed but unused
- The existing `bento-layout` spec mentions framer-motion for tap feedback, but animations are not implemented
- The app has rich UI elements (cards, tabs, charts, progress rings, modals) that would benefit from animation
- Animations improve perceived performance and create emotional connection with users

## Scope
This change adds animations to:
1. **Analytics Page**: Staggered card entries, tab transitions, number counting, chart reveals
2. **Timer Page**: Timer state transitions, button feedback, progress ring animations, modal slides
3. **Focus Box Page**: Bento grid animations, task card interactions, completion celebrations
4. **Profile Page**: Profile card reveal, stat counters, settings transitions
5. **Navigation/Layout**: Page transitions, bottom nav active state, shared element transitions

## Out of Scope
- Sound effects or haptic feedback
- Complex physics-based animations (keeping it performant)
- Animation preferences UI (though reduced-motion is respected)

## Dependencies
- `framer-motion` v11.0.8 (already installed)
- Existing page structure remains unchanged
