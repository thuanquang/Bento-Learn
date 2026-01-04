# analytics-history Specification

## Purpose
Define the History subsection of Analytics showing a filterable list of past focus sessions.

## ADDED Requirements

### Requirement: Session Count Filter
The History tab SHALL allow filtering by number of sessions displayed.

#### Scenario: Session Count Dropdown
- **Given** the History tab loads
- **When** the dropdown is rendered
- **Then** options should include: "Last 25", "Last 50", "Last 100"
- **And** "Last 25" should be selected by default

#### Scenario: Changing Filter
- **Given** the History tab is showing "Last 25"
- **When** the user selects "Last 100"
- **Then** the list should update to show up to 100 sessions
- **And** sessions should be ordered by most recent first

### Requirement: Session List Display
The History tab SHALL display sessions in a scrollable list.

#### Scenario: Session Card Rendering
- **Given** sessions exist
- **When** the list renders
- **Then** each session should display:
  - Session type badge (Timer / Bento / Routine)
  - Task name
  - Duration (in minutes)
  - Focus score percentage with color coding
  - Timestamp (relative or absolute date)

#### Scenario: Session Type Badge Colors
- **Given** sessions of different types
- **When** badges render
- **Then** Timer should use sage color
- **And** Bento should use brown color
- **And** Routine should use peach color

#### Scenario: Focus Score Color Coding
- **Given** sessions with varying focus scores
- **When** scores render
- **Then** scores ≥80% should be green (sage)
- **And** scores 50-79% should be yellow (peach)
- **And** scores <50% should be red (brown)

### Requirement: Bento Session Grouping
The History tab SHALL visually group Bento sessions that belong together.

#### Scenario: Bento Group Display
- **Given** 3 sessions share the same `bentoSessionId`
- **When** the list renders
- **Then** they may be displayed as a grouped card
- **Or** they may show with a visual connector indicating they're related
- **And** the group should show aggregate focus score

### Requirement: Empty State
The History tab SHALL handle the case of no sessions gracefully.

#### Scenario: No Sessions
- **Given** the user has no completed sessions
- **When** the History tab loads
- **Then** an empty state illustration should display
- **And** text should say "No sessions yet. Start your first focus session!"
- **And** a CTA button should link to the Timer page

### Requirement: Session Details (Optional Enhancement)
The History tab SHALL allow viewing session details on expansion.

#### Scenario: Expanding a Session
- **Given** a session card in the list
- **When** the user clicks/taps it
- **Then** expanded details may show:
  - Start and end times
  - Number of pauses
  - Detailed score breakdown
