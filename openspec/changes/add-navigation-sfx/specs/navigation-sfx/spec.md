# navigation-sfx Specification

## Purpose
Define the sound effects system for navigation transitions. SFX play during lid animations to provide satisfying audio feedback that adapts to user browsing patterns.

## ADDED Requirements

### Requirement: SFX Playback on Navigation
The application SHALL play sound effects during lid animations to provide audio feedback for page transitions.

#### Scenario: Opening SFX on navigation arrival
- **Given** the user navigates to a new page
- **And** the lid animation begins opening
- **When** the opening SFX trigger condition is met (per theme configuration)
- **Then** the opening SFX for the current theme SHALL play
- **And** the SFX SHALL respect velocity-based pitch and volume adjustments

#### Scenario: Closing SFX on navigation departure
- **Given** the user initiates navigation away from the current page
- **And** the lid animation closes
- **When** the closing SFX trigger condition is met (per theme configuration)
- **Then** the closing SFX for the current theme SHALL play
- **And** the SFX SHALL respect velocity-based pitch and volume adjustments

#### Scenario: SFX graceful fallback
- **Given** the SFX file for the current theme is missing or fails to load
- **When** the system attempts to play the SFX
- **Then** no sound SHALL play
- **And** no error SHALL be thrown to the user
- **And** a warning MAY be logged to the console

### Requirement: Velocity-Based SFX Adaptation
The SFX system SHALL adapt pitch and volume based on how long the user spent on the previous page (dwell time).

#### Scenario: Quick navigation SFX (< 5 seconds dwell)
- **Given** the user spent less than 5 seconds on the current page
- **When** they navigate away
- **Then** the closing SFX SHALL play with higher pitch (faster playback rate ~1.3x)
- **And** the closing SFX SHALL play at reduced volume (~70%)

#### Scenario: Normal navigation SFX (5-30 seconds dwell)
- **Given** the user spent between 5 and 30 seconds on the current page
- **When** they navigate away
- **Then** the SFX SHALL play at normal pitch (playback rate 1.0x)
- **And** the SFX SHALL play at full volume (100%)

#### Scenario: Deep dive SFX (> 30 seconds dwell)
- **Given** the user spent more than 30 seconds on the current page
- **When** they navigate away
- **Then** the closing SFX SHALL play with lower pitch (slower playback rate ~0.75x)
- **And** the closing SFX SHALL play at full volume (100%)

#### Scenario: Opening SFX velocity adaptation
- **Given** the user navigated from a previous page
- **When** the opening SFX plays on the new page
- **Then** the opening SFX SHALL use velocity adaptation based on time spent on the previous page
- **And** the same velocity thresholds apply as for closing SFX

### Requirement: Micro-Pitch Jitter
The SFX system SHALL apply subtle random pitch variation on each playback to prevent repetitive, robotic-sounding feedback.

#### Scenario: Pitch jitter application
- **Given** an SFX is triggered
- **When** the sound plays
- **Then** the playback rate SHALL be multiplied by a random factor between 0.95 and 1.05
- **And** this jitter SHALL be applied after velocity-based pitch adjustment
- **And** each playback SHALL use a fresh random value

### Requirement: Per-Theme SFX Configuration
The SFX system SHALL support optional per-theme SFX files and timing configuration for each box design.

#### Scenario: Theme with SFX configured
- **Given** the current box design has `sfxPaths` defined
- **When** a navigation transition occurs
- **Then** the SFX files specified in the theme configuration SHALL be used

#### Scenario: Theme without SFX configured
- **Given** the current box design does not have `sfxPaths` defined
- **When** a navigation transition occurs
- **Then** no SFX SHALL play
- **And** no error SHALL occur

#### Scenario: Theme-specific SFX timing
- **Given** a box design defines `sfxTiming` configuration
- **When** the lid animation progresses
- **Then** the opening SFX SHALL trigger according to `sfxTiming.openTrigger` ('start' or 'end')
- **And** the closing SFX SHALL trigger according to `sfxTiming.closeTrigger` ('start' or 'end')

#### Scenario: Default SFX timing
- **Given** a box design does not define `sfxTiming` configuration
- **When** the lid animation progresses
- **Then** the opening SFX SHALL trigger at animation start
- **And** the closing SFX SHALL trigger at animation end

### Requirement: Web Audio API Implementation
The SFX system SHALL use the Web Audio API for playback to enable precise pitch and volume control.

#### Scenario: AudioContext initialization
- **Given** the user interacts with the application (e.g., clicks navigation)
- **When** an SFX needs to play
- **Then** an AudioContext SHALL be created if not already initialized
- **And** the AudioContext SHALL be resumed if suspended (browser autoplay policy)

#### Scenario: Audio buffer preloading
- **Given** a theme is selected that has SFX configured
- **When** the theme is applied
- **Then** the SFX audio files SHALL be preloaded into audio buffers
- **And** subsequent playback SHALL use the cached buffers for low latency

#### Scenario: Browser without Web Audio API support
- **Given** the browser does not support Web Audio API
- **When** the application attempts to play SFX
- **Then** playback SHALL fail silently
- **And** no error SHALL be shown to the user
