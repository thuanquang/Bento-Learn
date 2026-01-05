# analytics-animations Specification

## Purpose
Framer Motion animations for the Analytics page, enhancing the dashboard with smooth reveals and interactive feedback.

## ADDED Requirements

### Requirement: Greeting Card Animation
The greeting card SHALL animate on page mount.

#### Scenario: Greeting Fade In
- **Given** the Analytics page loads
- **When** the greeting card mounts
- **Then** it should fade in from opacity 0 to 1
- **And** slide up from y: 20 to y: 0 over 400ms

### Requirement: Stats Card Stagger
Stats cards SHALL animate in a staggered sequence.

#### Scenario: Stats Cards Stagger Entry
- **Given** the Analytics Overview tab loads
- **When** the stats cards mount
- **Then** each card should animate in sequence
- **And** there should be a 100ms delay between each card
- **And** each card should scale from 0.95 to 1

### Requirement: Tab Content Transitions
Tab content SHALL animate when switching tabs.

#### Scenario: Tab Switch Animation
- **Given** the user is viewing any Analytics tab
- **When** they click a different tab
- **Then** the current content should fade out
- **And** the new content should fade in
- **And** AnimatePresence should handle exit animations

### Requirement: Focus Score Counter
The focus score SHALL count up on reveal.

#### Scenario: Score Count Animation
- **Given** the Insights tab loads
- **When** the focus score hero is visible
- **Then** the score should animate from 0 to the actual value
- **And** the animation should take approximately 1 second
- **And** use easing for natural feel

### Requirement: Award Card Expansion
Award category headers SHALL have interactive feedback.

#### Scenario: Award Category Tap
- **Given** the user views the Awards tab
- **When** they tap a category header
- **Then** the header should scale down to 0.98 on press
- **And** the awards list should animate height from 0 to auto
