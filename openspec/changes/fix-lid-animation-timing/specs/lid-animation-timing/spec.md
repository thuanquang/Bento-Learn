# lid-animation-timing Specification

## Purpose
Define the strict timing and sequencing requirements for the bento box lid animation during navigation transitions, ensuring the previous screen remains visible until the lid closes and the new screen is fully ready before the lid opens.

## MODIFIED Requirements

### Requirement: Navigation Lid Animation (Strict Sequencing)
The bento box lid animation SHALL follow a strict 4-phase sequence during navigation: visible → closing → swapping → opening.

> **Modifies**: `bento-container` spec > "Requirement: Navigation Lid Animation"

#### Scenario: Standard navigation between pages
- **Given** the user is viewing Screen A inside the bento box
- **When** the user triggers navigation to Screen B
- **Then** Screen A SHALL remain visible and unchanged
- **And** the lid SHALL begin its closing animation (300ms, sliding over the box)
- **And** Screen A SHALL NOT be unmounted or hidden until the lid closing animation completes
- **And** once the lid is fully closed, Screen A SHALL be unmounted
- **And** Screen B SHALL begin loading/mounting
- **And** the lid SHALL remain closed until Screen B signals it is fully ready
- **And** once Screen B is ready, the lid SHALL begin its opening animation (300ms)
- **And** Screen B SHALL be fully visible when the lid opening animation completes

#### Scenario: Content readiness detection
- **Given** the lid has fully closed and Screen A has been unmounted
- **When** Screen B is mounting
- **Then** the system SHALL wait for Screen B's React component to complete its initial render
- **And** the system SHALL wait for any `layout` animations on Screen B to settle
- **And** only after both conditions are met SHALL the lid opening animation begin

#### Scenario: Slow content loading
- **Given** the lid has fully closed
- **When** Screen B takes longer than 500ms to become ready
- **Then** a loading indicator SHALL appear under the closed lid
- **And** the loading indicator SHALL be hidden before the lid opens
- **And** the lid SHALL NOT open until Screen B is ready (regardless of loading time)

#### Scenario: Rapid navigation (navigation during closing phase)
- **Given** the lid is in the closing phase for navigation to Screen B
- **When** the user triggers navigation to Screen C before the lid fully closes
- **Then** the lid SHALL continue closing
- **And** once closed, the system SHALL navigate to Screen C (skipping Screen B entirely)
- **And** Screen B SHALL NOT be loaded

#### Scenario: Rapid navigation (navigation during loading/opening phase)
- **Given** the lid is closed and Screen B is loading, or the lid is opening
- **When** the user triggers navigation to Screen C
- **Then** if the lid is opening, it SHALL reverse direction and close
- **And** once closed, the system SHALL navigate to Screen C
- **And** if Screen B was partially mounted, it SHALL be unmounted

#### Scenario: Reduced motion preference
- **Given** the user has `prefers-reduced-motion: reduce` enabled
- **When** navigating between pages
- **Then** the lid animation SHALL be skipped entirely
- **And** the content SHALL swap instantly without visual transition
- **And** there SHALL be no delay between Screen A unmount and Screen B mount

### Requirement: Animation Phase State Machine
The BentoBoxContainer SHALL manage animation phases using an explicit state machine.

#### Scenario: State machine phases
- **Given** the BentoBoxContainer is managing navigation transitions
- **When** tracking animation state
- **Then** the state machine SHALL have the following phases: `idle`, `closing`, `loading`, `opening`
- **And** transitions SHALL only occur in order: `idle` → `closing` → `loading` → `opening` → `idle`
- **And** navigation requests during non-idle phases SHALL be queued or handled per rapid navigation scenarios
