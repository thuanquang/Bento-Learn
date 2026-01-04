# Proposal: redesign-focus-app

## Summary
Complete redesign of Bento Learn into a soft, minimalistic focus timer application with 4 main navigation pages: **Analytics**, **Timer**, **Focus Box**, and **Profile**. This replaces all existing functionality with a cohesive ADHD-friendly productivity system featuring focus scoring, achievements, and ambient sounds.

## Motivation
The current implementation has a learning resource tracker with Macro/Meso/Micro tiers. The user wants to pivot to a dedicated focus timer app with:
- Visual analytics and gamification (awards/achievements)
- Single-task timer with ambient sounds
- Multi-task "Bento Box" sessions (3 tasks)
- Focus Score tracking to encourage uninterrupted work
- Soft, minimalistic aesthetic using a curated bento-grid color palette

## Scope

### In Scope
1. **Complete Database Redesign** - New schema for sessions, focus scores, awards, and user stats
2. **4-Page Navigation** - Analytics, Timer, Focus Box, Profile
3. **Analytics Dashboard** with 4 subsections:
   - Overview (greeting, focus score, streak, session type pie chart)
   - Insights (focus score trends, smart insights, personal insights)
   - Awards (achievements with progress tracking)
   - History (session logs with focus scores)
4. **Timer Page** - Configurable single-task timer with ambient sounds and pause/resume
5. **Focus Box Page** - 3-task bento session with drag-to-reorder queue
6. **Profile Page** - Basic user info and settings
7. **Design System** - Soft minimalistic UI with bento-grid color palette
8. **Focus Score Algorithm** - Decreasing score based on interruptions

### Out of Scope
- Authentication/login (use existing or add later)
- Custom user-uploaded sounds
- Social features
- Mobile native app

## Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `sage` | `#C5C9A4` | Primary backgrounds, main cards |
| `brown` | `#7A6052` | Accents, secondary buttons |
| `peach` | `#D4A27C` | Highlights, awards, CTAs |
| `charcoal` | `#3A3A3A` | Text, dark UI elements |
| `cream` | `#F8F8F8` | Light backgrounds, cards |
| `sage-muted` | `#B5C4A8` | Secondary cards, hover states |

## Success Criteria
- [ ] All 4 navigation pages are functional and styled
- [ ] Timer works with configurable duration and ambient sounds
- [ ] Focus Box allows 3-task queue with drag reorder
- [ ] Focus Score calculates correctly based on pauses/interruptions
- [ ] All 16 awards are trackable and unlockable
- [ ] History shows session logs with focus scores
- [ ] UI matches soft minimalistic bento aesthetic

## Related Specs
- `navigation` - Main 4-page navigation structure
- `database-schema` - Complete schema redesign (replaces existing)
- `timer` - Single-task timer with ambient sounds
- `focus-box` - Multi-task bento sessions
- `analytics-overview` - Overview subsection
- `analytics-insights` - Insights subsection
- `analytics-awards` - Awards/achievements system
- `analytics-history` - Session history
- `profile` - Basic profile page
- `design-system` - Color palette and component styles
