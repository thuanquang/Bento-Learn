# profile Specification

## Purpose
Define the basic Profile page showing user information, quick stats, and settings.

## ADDED Requirements

### Requirement: User Info Card
The Profile page SHALL display the user's basic information.

#### Scenario: User Info Display
- **Given** the user visits the Profile page
- **When** the page loads
- **Then** a card should display:
  - User avatar (image or initials placeholder)
  - User's display name
  - Username (if set)
  - Edit button to update profile

#### Scenario: Editing Profile (Basic)
- **Given** the user clicks "Edit"
- **When** the edit mode activates
- **Then** the display name should become editable
- **And** a "Save" button should appear
- **And** changes should persist to the database

### Requirement: Quick Stats Display
The Profile page SHALL show aggregated user statistics.

#### Scenario: Stats Rendering
- **Given** the user has session history
- **When** the page loads
- **Then** a stats section should display:
  - Total sessions completed
  - Total focus hours (formatted as Xh Ym)
  - Current streak (with flame icon if active)
  - Member since date

#### Scenario: No Stats Yet
- **Given** the user is new with no sessions
- **When** the page loads
- **Then** stats should show "0" for sessions and hours
- **And** streak should show "0 days"
- **And** an encouraging message should appear

### Requirement: Settings Section
The Profile page SHALL provide basic user settings.

#### Scenario: Default Timer Duration Setting
- **Given** the settings section
- **When** the user selects a default timer duration
- **Then** options should include: 15, 25, 45, 60 minutes
- **And** the selection should persist
- **And** the Timer page should use this as its initial duration

#### Scenario: Default Sound Preference
- **Given** the settings section
- **When** the user selects a default ambient sound
- **Then** options should include all available sounds
- **And** the selection should persist
- **And** the Timer/Focus Box pages should use this by default

### Requirement: Profile Layout
The Profile page SHALL use the bento color palette and minimalist design.

#### Scenario: Visual Design
- **Given** the Profile page
- **When** it renders
- **Then** the background should use cream color
- **And** cards should have subtle shadows
- **And** typography should use the design system fonts
- **And** interactive elements should have clear hover states
