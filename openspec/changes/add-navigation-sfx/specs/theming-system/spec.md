# theming-system Specification (Delta)

## Purpose
Extend the theming system to support per-theme sound effects configuration.

## MODIFIED Requirements

### Requirement: Theme Context Provider
The application SHALL provide a theme context that exposes the current box design and its associated color palette.

#### Scenario: Accessing theme context
- **Given** a component needs to access theming information
- **When** it uses the useBoxTheme hook
- **Then** it should receive the current selected box design
- **And** it should receive the list of unlocked box designs
- **And** it should receive the active color palette (if defined by the box design)
- **And** it should receive a method to change the selected box

#### Scenario: Theme provider in component tree
- **Given** the application initializes
- **When** the layout renders
- **Then** the BoxThemeProvider should wrap the main content
- **And** all child components should have access to the theme context

#### Scenario: Accessing theme SFX configuration
- **Given** a component needs SFX file paths
- **When** it uses the useBoxTheme hook
- **Then** it should receive the selected box design
- **And** the box design MAY include `sfxPaths` with `open` and `close` audio file paths
- **And** the box design MAY include `sfxTiming` with trigger configuration

## ADDED Requirements

### Requirement: Box Design SFX Extension
The box design interface SHALL support optional SFX file paths and timing configuration.

#### Scenario: Box design with SFX paths
- **Given** a box design is registered
- **When** it includes an `sfxPaths` property
- **Then** the property SHALL have `open` and `close` string paths to audio files
- **And** these paths SHALL be relative to the public directory (e.g., `/sounds/sfx/wooden-classic/open.mp3`)

#### Scenario: Box design with SFX timing
- **Given** a box design is registered
- **When** it includes an `sfxTiming` property
- **Then** the property SHALL have `openTrigger` set to `'start'` or `'end'`
- **And** the property SHALL have `closeTrigger` set to `'start'` or `'end'`
- **And** these values control when SFX plays relative to lid animation phases
