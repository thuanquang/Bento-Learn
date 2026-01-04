# navigation Specification

## Purpose
Define the main 4-page navigation structure with a bottom navigation bar providing access to Analytics, Timer, Focus Box, and Profile pages.

## ADDED Requirements

### Requirement: Bottom Navigation Bar
The application SHALL display a persistent bottom navigation bar on all main pages.

#### Scenario: Navigation Bar Rendering
- **Given** the user is on any page within the main app
- **When** the page loads
- **Then** a bottom navigation bar should be visible with 4 buttons: Analytics, Timer, Focus Box, Profile
- **And** each button should have an icon and label
- **And** the active page should be visually highlighted with the sage color (`#C5C9A4`)

#### Scenario: Navigation Between Pages
- **Given** the user is viewing any page
- **When** they tap a navigation button
- **Then** they should be navigated to the corresponding page
- **And** the URL should update to `/analytics`, `/timer`, `/focus-box`, or `/profile`
- **And** the navigation transition should be smooth (300ms)

### Requirement: Responsive Navigation
The navigation SHALL adapt to different screen sizes while maintaining usability.

#### Scenario: Mobile Navigation
- **Given** a viewport width of 375px or less
- **When** the navigation renders
- **Then** icons should be at least 24x24px
- **And** touch targets should be at least 44x44px
- **And** labels may be hidden to conserve space

#### Scenario: Desktop Navigation
- **Given** a viewport width of 768px or more
- **When** the navigation renders
- **Then** the nav bar may appear as a sidebar or remain at bottom
- **And** labels should always be visible alongside icons
