# Wooden Classic SFX

Place your sound effect files here:

- `open.mp3` - Plays when the lid starts opening (arriving at a new page)
- `close.mp3` - Plays when the lid finishes closing (leaving a page)

## Recommended Format
- **Format**: MP3 (widely supported, good compression)
- **Duration**: 0.2-0.5 seconds for snappy feedback
- **Sample Rate**: 44.1kHz
- **Bitrate**: 128-192 kbps

## Velocity Variations
The SFX player automatically applies pitch and volume adjustments based on how long the user spent on the page:

| Dwell Time | Pitch | Volume |
|------------|-------|--------|
| < 5s (quick) | Higher (~1.3x) | 70% |
| 5-30s (normal) | Normal (1.0x) | 100% |
| > 30s (deep) | Lower (~0.75x) | 100% |

A micro-pitch jitter (±5%) is also applied to each playback for natural variation.
