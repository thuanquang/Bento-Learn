## ADDED Requirements

### Requirement: Persistent Timer State Across Navigation
The system SHALL maintain timer state (time remaining, running/paused status, pause count, task name) when the user navigates between pages within the main application layout.

#### Scenario: Timer continues when navigating away
- **WHEN** user has a running timer on the Timer page
- **AND** user navigates to the Focus Box page
- **THEN** the timer continues counting down in the background
- **AND** when user returns to the Timer page, the current time remaining is displayed

#### Scenario: Timer state visible on return
- **WHEN** user started a 25-minute timer, navigates away for 5 minutes, then returns
- **THEN** the timer shows approximately 20 minutes remaining
- **AND** the progress ring reflects the elapsed time

### Requirement: New Session Reset
The system SHALL provide a "New Session" button after timer completion that resets the timer to idle state with default configuration, allowing the user to start a fresh session.

#### Scenario: New Session clears previous state
- **WHEN** user completes a focus session
- **AND** user clicks "New Session"
- **THEN** the timer resets to idle state
- **AND** the task name input field is cleared or reset to default
- **AND** the duration selector becomes visible and editable
- **AND** the focus score display is hidden

### Requirement: Dynamic Browser Tab Title
The system SHALL update the browser tab title to reflect the current session name and timer countdown when a timer is actively running or paused.

#### Scenario: Tab title shows session info
- **WHEN** user starts a timer with task name "Write documentation"
- **THEN** the browser tab title shows "Write documentation - 25:00 | Bento Focus"
- **AND** as the timer counts down, the title updates (e.g., "Write documentation - 24:59 | Bento Focus")

#### Scenario: Tab title resets when idle
- **WHEN** timer is in idle or completed state
- **THEN** the browser tab title shows "Bento Focus"

#### Scenario: Tab title reflects paused state
- **WHEN** user pauses the timer at 15:30 remaining
- **THEN** the browser tab title continues to show "Task Name - 15:30 | Bento Focus"
- **AND** the title does not change until resumed or reset
