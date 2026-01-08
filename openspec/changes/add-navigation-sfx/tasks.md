# Tasks: Add Navigation Sound Effects

## 1. Core SFX System
- [x] 1.1 Create `lib/sfx-config.ts` with velocity thresholds and pitch/volume constants
- [x] 1.2 Create `lib/sfx-player.ts` with Web Audio API player class:
  - AudioContext management (lazy initialization)
  - Audio buffer preloading and caching
  - `play(url, options: { pitchRate, volume })` method
  - Micro-pitch jitter application
  - Graceful fallback for unsupported browsers
- [ ] 1.3 Add unit tests for SFX player pitch/volume calculations (skipped - no test framework configured)

## 2. Theme Integration
- [x] 2.1 Extend `BentoBoxDesign` interface in `lib/box-designs.tsx`:
  - Add `sfxPaths?: { open: string; close: string }`
  - Add `sfxTiming?: { openTrigger: 'start' | 'end'; closeTrigger: 'start' | 'end' }`
- [x] 2.2 Add SFX configuration to `wooden-classic` design with placeholder paths
- [x] 2.3 Create directory structure `public/sounds/sfx/wooden-classic/`
- [x] 2.4 Add placeholder audio files (or document expected file locations)
  - Created `public/sounds/sfx/wooden-classic/README.md` documenting file requirements

## 3. Navigation Context Updates
- [x] 3.1 Add `pageArrivalTime` state to `NavigationTransitionContext`
- [x] 3.2 Update `pageArrivalTime` when navigation completes (phase → `idle`)
- [x] 3.3 Calculate dwell time when navigation starts and store it for SFX
- [x] 3.4 Expose `currentDwellTime` or velocity category from context
  - Exposed as `lastDwellTimeMs` in the context

## 4. SFX Playback Integration
- [x] 4.1 Create `useSfxPlayer` hook that:
  - Gets current theme's SFX paths from `useBoxTheme`
  - Preloads audio buffers when theme changes
  - Exposes `playOpenSfx()` and `playCloseSfx()` methods
- [x] 4.2 Integrate SFX hook into `BentoBoxContainer.tsx`:
  - Play opening SFX on animation start (for wooden-classic: phase → `opening`)
  - Play closing SFX on animation complete (for wooden-classic: `onAnimationComplete` when closing)
- [x] 4.3 Pass velocity category to SFX player for pitch/volume adjustment
- [x] 4.4 Apply micro-pitch jitter on each playback

## 5. Verification
- [ ] 5.1 Manual test: Navigate between pages, verify SFX plays at correct moments
- [ ] 5.2 Manual test: Quick navigation (< 5s) produces lighter SFX
- [ ] 5.3 Manual test: Deep dive (> 30s) produces deeper SFX
- [ ] 5.4 Manual test: Rapid repeated navigation has audible pitch variation
- [x] 5.5 Verify no console errors when SFX files are missing (graceful fallback)
  - Code includes try/catch and console.warn only
- [x] 5.6 Run `npm run build` to confirm no TypeScript errors
  - Build passed successfully

## 6. Documentation
- [x] 6.1 Update `docs/THEMING.md` with SFX extension points
- [x] 6.2 Document SFX file format requirements (MP3, recommended duration/size)
  - Added to THEMING.md and README in sfx folder
- [x] 6.3 Add comments in `sfx-config.ts` explaining each constant

## Dependencies
- Tasks 1.x can be done in parallel with 2.x
- Task 3.x must complete before 4.x
- Task 4.x requires 1.x, 2.x, and 3.x to be complete
- Task 5.x requires placeholder audio files or mocked playback

## Notes
- Manual testing (5.1-5.4) requires actual audio files to be added by the user
- Unit tests (1.3) skipped as no test framework is currently configured
