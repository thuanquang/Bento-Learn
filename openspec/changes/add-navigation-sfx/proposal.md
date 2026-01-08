# Change: Add Navigation Sound Effects

## Why
The bento box lid animation currently lacks audio feedback, making the interaction feel flat. Adding theme-specific sound effects for opening and closing the lid will enhance the tactile, satisfying experience of navigating between pages—reinforcing the "physical bento box" metaphor.

## What Changes
- Add a new SFX player system using the Web Audio API for precise playback control
- Extend the box design interface to include theme-specific SFX file paths
- Implement "Velocity Mapping" that adapts SFX characteristics based on page dwell time:
  - **Quick Navigation** (< 5s on page): Lighter, quieter, higher-pitched SFX
  - **Normal Navigation** (5-30s): Standard SFX
  - **Deep Dive** (> 30s): Deeper, weightier, lower-pitched SFX
- Add micro-pitch jitter (playbackRate 0.95–1.05) on every playback for natural variation
- Support per-theme timing configuration (when SFX triggers relative to animation phases)

## Impact
- Affected specs: `theming-system` (extends box design interface)
- New capability: `navigation-sfx`
- Affected code:
  - `lib/box-designs.tsx` - Add SFX paths to BentoBoxDesign interface
  - `lib/sfx-player.ts` - New SFX player using Web Audio API
  - `lib/navigation-transition-context.tsx` - Track page dwell time, trigger SFX
  - `components/bento-container/BentoBoxContainer.tsx` - Connect SFX to animation events
  - `public/sounds/sfx/` - Directory structure for theme SFX files
