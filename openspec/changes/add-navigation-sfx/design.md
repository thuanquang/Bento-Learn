# Design: Navigation Sound Effects System

## Context
The Bento Focus app uses a lid animation during page transitions. Users expect audio feedback that:
1. Reinforces the physical bento box metaphor
2. Adapts to browsing patterns (quick vs deep engagement)
3. Varies subtly to avoid repetitive fatigue
4. Is easily swappable per theme for future customization

### Stakeholders
- **Users**: Want satisfying, non-intrusive audio feedback
- **Devs**: Need clean extension points for theme SFX and timing adjustments

## Goals / Non-Goals

**Goals:**
- Play opening/closing SFX synchronized with lid animations
- Support per-theme SFX files and timing configuration
- Implement velocity-based SFX adaptation using Web Audio API pitch/volume
- Add subtle pitch randomization for natural feel
- Make timing easily adjustable without code changes

**Non-Goals:**
- Full audio settings UI (future enhancement)
- Background music integration
- Accessibility audio descriptions (separate concern)

## Decisions

### Decision 1: Web Audio API over HTMLAudioElement
**What:** Use Web Audio API (`AudioContext`, `AudioBufferSourceNode`) instead of `<audio>` element.

**Why:**
- Precise control over playbackRate for pitch shifting
- Can apply real-time gain (volume) adjustments
- Low-latency playback for responsive feel
- Supports preloading audio buffers

**Alternatives considered:**
- `HTMLAudioElement` with `playbackRate`: Simpler but less control over gain/effects
- Howler.js: Good library but adds dependency; Web Audio API is native and sufficient

### Decision 2: Dwell Time Tracking in Navigation Context
**What:** Track page arrival time in `NavigationTransitionContext` and calculate dwell time on navigation.

**Why:**
- Navigation context already manages transition phases
- Single source of truth for navigation state
- Avoids additional context or global state

### Decision 3: Per-Theme SFX Timing Configuration
**What:** Add `sfxTiming` config to `BentoBoxDesign`:
```typescript
sfxTiming?: {
  openTrigger: 'start' | 'end';  // When to play opening SFX
  closeTrigger: 'start' | 'end'; // When to play closing SFX
}
```

**Why:** Different box designs may have different animation feels (e.g., a snappy metal box vs a slow wooden lid).

**Default for wooden-classic:**
- `openTrigger: 'start'` - Play when lid starts opening
- `closeTrigger: 'end'` - Play when lid finishes closing

### Decision 4: Velocity Mapping via Pitch + Volume
**What:** Map dwell time to playback characteristics:

| Dwell Time | Category | Pitch Modifier | Volume Modifier |
|------------|----------|----------------|-----------------|
| < 5s | Quick | +5 semitones (rate ~1.3) | 70% |
| 5-30s | Normal | 0 (rate 1.0) | 100% |
| > 30s | Deep | -5 semitones (rate ~0.75) | 100% |

Then apply micro-jitter: `finalRate = baseRate * random(0.95, 1.05)`

**Why:**
- Quick navigation = light, snappy feedback
- Deep dive = weighty, satisfying "packing away" feel
- Micro-jitter prevents robotic repetition

### Decision 5: SFX File Structure
**What:** Store SFX files per theme:
```
public/sounds/sfx/
└── [theme-id]/
    ├── open.mp3
    └── close.mp3
```

**Why:**
- Simple 1:1 mapping
- Web Audio API handles pitch/volume variations programmatically
- Easy to add new themes by dropping files in folder

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Audio autoplay blocked by browsers | Only play after user interaction (navigation click); gracefully handle play failures |
| Large audio files slow loading | Preload buffers on theme selection; use compressed MP3 |
| Web Audio API not supported | Check for `AudioContext` support; silent fallback |
| SFX files missing | Log warning, continue without sound |

## Configuration Points

For easy manual adjustment, expose timing constants:
```typescript
// lib/sfx-config.ts
export const SFX_CONFIG = {
  VELOCITY_QUICK_THRESHOLD_MS: 5000,   // < 5s = quick
  VELOCITY_DEEP_THRESHOLD_MS: 30000,   // > 30s = deep
  PITCH_QUICK_RATE: 1.3,               // Higher pitch for quick
  PITCH_DEEP_RATE: 0.75,               // Lower pitch for deep
  VOLUME_QUICK: 0.7,                   // Quieter for quick
  JITTER_MIN: 0.95,                    // Micro-pitch jitter range
  JITTER_MAX: 1.05,
};
```

## Open Questions
- Should there be a user preference to disable SFX? (Future enhancement, not blocking)
- Should SFX volume follow the ambient sound volume setting? (Consider in implementation)
