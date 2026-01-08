# theming-system Specification

## Purpose
Define the theming system that enables page components to adapt their colors based on the selected bento box design. This capability establishes the foundation; actual component theming will be implemented in future changes.

## ADDED Requirements

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

### Requirement: Color Palette Integration
The box design interface SHALL support an optional color palette for future component theming.

#### Scenario: Box design with color palette
- **Given** a box design defines a colorPalette property
- **When** the design is selected
- **Then** the activeColorPalette in theme context should reflect those colors
- **And** these colors should be available for components to use

#### Scenario: Box design without color palette
- **Given** a box design does not define a colorPalette property
- **When** the design is selected
- **Then** the activeColorPalette should be null or use app defaults
- **And** components should fall back to the default bento color palette

### Requirement: Profile Box Selector Section
The Profile page SHALL include a section for viewing and selecting unlocked box designs.

#### Scenario: Viewing box selector
- **Given** a user navigates to the Profile page
- **When** the page renders
- **Then** a "Bento Box Style" section should be displayed
- **And** it should show a grid of available box designs

#### Scenario: Box design display states
- **Given** the box selector is displayed
- **When** viewing available designs
- **Then** unlocked designs should be selectable
- **And** locked designs should show a lock indicator
- **And** locked designs should display their unlock criteria
- **And** the currently selected design should be highlighted

#### Scenario: Changing box design
- **Given** the user views the box selector
- **When** they tap on an unlocked box design
- **Then** the design should become selected
- **And** the selection should be visually confirmed
- **And** the change should apply to the app immediately
- **And** the preference should be saved to the server
