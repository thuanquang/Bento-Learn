# analytics-overview Specification

## Purpose
Define the Overview subsection of Analytics showing user greeting, focus score, streak, and session type distribution.

## ADDED Requirements

### Requirement: User Greeting Card
The Overview SHALL display a personalized greeting with the current date.

#### Scenario: Morning Greeting
- **Given** the current time is between 5:00 and 11:59
- **When** the Overview loads
- **Then** it should display "Good morning, {name}!"
- **And** the current date should be shown below

#### Scenario: Afternoon Greeting
- **Given** the current time is between 12:00 and 16:59
- **When** the Overview loads
- **Then** it should display "Good afternoon, {name}!"

#### Scenario: Evening Greeting
- **Given** the current time is between 17:00 and 4:59
- **When** the Overview loads
- **Then** it should display "Good evening, {name}!"

### Requirement: Focus Score Badge Display
The Overview SHALL prominently display the user's current focus score.

#### Scenario: Focus Score Rendering
- **Given** the user has completed sessions
- **When** the Overview loads
- **Then** a large circular badge should display the average focus score as a percentage
- **And** the badge should use color coding:
  - Green (≥80%): sage color
  - Yellow (50-79%): peach color
  - Red (<50%): brown color

#### Scenario: No Sessions
- **Given** the user has no completed sessions
- **When** the Overview loads
- **Then** the focus score should show "—" or "N/A"
- **And** a prompt should encourage starting a session

### Requirement: Streak Counter
The Overview SHALL display the user's current day streak.

#### Scenario: Active Streak
- **Given** the user has completed sessions on consecutive days
- **When** the Overview loads
- **Then** a streak counter should display "{N} day streak"
- **And** a flame icon (🔥) should be shown
- **And** the flame may have a subtle animation

#### Scenario: No Active Streak
- **Given** the user has no recent sessions
- **When** the Overview loads
- **Then** the streak should show "0 day streak"
- **And** a message should encourage starting today

### Requirement: Session Type Distribution Chart
The Overview SHALL display a pie chart of session types.

#### Scenario: Pie Chart Rendering
- **Given** the user has completed sessions of various types
- **When** the Overview loads with "Last 25" selected
- **Then** a pie chart should show distribution of Timer, Bento, and Routine sessions
- **And** each type should have a distinct color from the palette
- **And** percentages should be displayed on hover or as labels

#### Scenario: Session Count Selector
- **Given** the pie chart is displayed
- **When** the user selects "Last 50" or "Last 100" from a dropdown
- **Then** the chart should update to reflect the selected session range

#### Scenario: No Sessions
- **Given** the user has no completed sessions
- **When** the Overview loads
- **Then** an empty state should be shown instead of the chart
- **And** a prompt should encourage starting a session
