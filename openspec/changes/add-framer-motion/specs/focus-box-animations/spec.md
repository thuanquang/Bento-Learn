# focus-box-animations Specification

## Purpose
Framer Motion animations for the Focus Box page, emphasizing the bento-style layout with playful, satisfying interactions.

## ADDED Requirements

### Requirement: Bento Grid Entry
The bento grid SHALL animate on page mount.

#### Scenario: Task Slots Stagger
- **Given** the Focus Box config page loads
- **When** the bento grid mounts
- **Then** task slots should stagger in with 100ms delay each
- **And** each slot should scale from 0.9 to 1.0 with fade

### Requirement: Task Slot Interaction
Task slots SHALL have rich drag and tap feedback.

#### Scenario: Drag Feedback
- **Given** the user starts dragging a task slot
- **When** the drag is active
- **Then** the slot should scale up to 1.03
- **And** it should have elevated shadow
- **And** other slots should shift smoothly via layout animations

#### Scenario: Task Slot Tap
- **Given** an interactive task slot
- **When** the user taps it
- **Then** it should scale to 0.97 via spring animation

### Requirement: Session State Transitions
Focus Box views SHALL transition smoothly.

#### Scenario: Config to Running Transition
- **Given** the user starts a focus session
- **When** transitioning from config to running view
- **Then** the config should fade and scale out
- **And** the running view should fade and scale in
- **And** AnimatePresence should coordinate the transition

### Requirement: Task Completion Celebration
Task completion SHALL have celebratory feedback.

#### Scenario: Intermission Reveal
- **Given** a task timer completes
- **When** the intermission view appears
- **Then** the checkmark should scale and bounce in
- **And** the "Task Complete!" text should fade in with delay
- **And** the next task card should slide up

### Requirement: Results Animation
Completed session results SHALL animate.

#### Scenario: Results List Stagger
- **Given** the session completes
- **When** the completed view shows
- **Then** result cards should stagger in from bottom
- **And** stats should count up to final values
