# bento-container Specification

## Purpose
Define the visual bento box container that wraps all main content pages, including the animated lid transitions during navigation and the modular box design system.

## ADDED Requirements

### Requirement: Bento Box Visual Container
The main content area SHALL be wrapped in a visual bento box container (top-down view) that is centered on the screen.

#### Scenario: Viewing any main page
- **Given** a user is on any page (Analytics, Timer, Focus Box, or Profile)
- **When** the page renders
- **Then** the content should be displayed inside a visual bento box container
- **And** the box should be horizontally and vertically centered on the viewport
- **And** the box should have the currently selected design applied

#### Scenario: Default box design
- **Given** a user has not selected a custom box design
- **When** viewing any page
- **Then** the default wooden-style bento box should be displayed

### Requirement: Navigation Lid Animation
The bento box SHALL animate its lid during page navigation transitions using Framer Motion.

#### Scenario: Navigating to a different page
- **Given** the user is on any main page
- **When** the user navigates to a different page
- **Then** Framer Motion `useAnimation` hook should orchestrate the 3-phase sequence
- **And** the lid should animate to close over the box (300ms) using `motion.div` with `y` transform
- **And** after the lid closes, the loading state should begin
- **And** the box should animate to resize to the target page dimensions (400ms) using Framer Motion layout animations
- **And** after loading completes, the lid should animate open and disappear (300ms) with `y` transform and `opacity` fade
- **And** the box should maintain center alignment throughout
- **And** `AnimatePresence` should handle content enter/exit transitions

#### Scenario: Reduced motion preference
- **Given** a user has prefers-reduced-motion enabled
- **When** navigating between pages
- **Then** the lid animation should be skipped
- **And** the content should transition instantly

### Requirement: Dynamic Box Sizing
The bento box SHALL dynamically size to fit the content of each page.

#### Scenario: Navigating to a larger page
- **Given** the user is on a page with smaller content
- **When** navigating to a page with larger content
- **Then** the box should animate to expand to the new dimensions
- **And** the expansion should occur during the resize phase (while lid is closed)

#### Scenario: Navigating to a smaller page
- **Given** the user is on a page with larger content
- **When** navigating to a page with smaller content
- **Then** the box should animate to contract to the new dimensions
- **And** the content should remain properly contained

### Requirement: Modular Box Design System
The system SHALL support multiple swappable bento box designs through a modular registry.

#### Scenario: Registering a new box design
- **Given** a developer creates a new box design component
- **When** they register it in the box design registry
- **Then** the design should be available for selection
- **And** the design should include box and lid components
- **And** the design may optionally include a color palette for theming

#### Scenario: Box design interface
- **Given** a box design is implemented
- **When** it is used by the BentoBoxContainer
- **Then** it must provide a BoxComponent (renders the box visuals)
- **And** it must provide a LidComponent (renders the lid visuals)
- **And** it must have a unique ID and display name
- **And** it may specify unlock requirements

### Requirement: Unlockable Box Designs
The system SHALL support unlocking box designs based on user progress.

#### Scenario: Viewing locked box designs
- **Given** a user has not met the unlock requirements for a box design
- **When** viewing available box designs
- **Then** the locked designs should be visually distinguished
- **And** the unlock criteria should be displayed

#### Scenario: Unlocking a box design
- **Given** a box design requires a specific award
- **When** the user earns that award
- **Then** the box design should become available for selection

#### Scenario: Unlocking via session count
- **Given** a box design requires a certain number of sessions
- **When** the user's total sessions meets or exceeds that count
- **Then** the box design should become available for selection

### Requirement: Box Design Persistence
The system SHALL persist the user's selected box design.

#### Scenario: Selecting a box design
- **Given** a user has unlocked multiple box designs
- **When** they select a different box design in Profile
- **Then** the selection should be saved to the database
- **And** the new design should apply immediately

#### Scenario: Loading saved box design
- **Given** a user has previously selected a box design
- **When** they return to the app
- **Then** their saved box design should be loaded and applied
