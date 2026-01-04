# timer Specification

## Purpose
Define the single-task timer functionality with configurable duration, ambient sounds, pause/resume controls, and focus score calculation.

## ADDED Requirements

### Requirement: Configurable Timer Duration
The timer SHALL allow users to set a custom focus duration.

#### Scenario: Selecting a Preset Duration
- **Given** the timer is in idle state
- **When** the user selects a preset (15, 25, 45, or 60 minutes)
- **Then** the timer should display the selected duration
- **And** the duration selector should show the selected option as active

#### Scenario: Setting a Custom Duration
- **Given** the timer is in idle state
- **When** the user enters a custom duration between 1-120 minutes
- **Then** the timer should accept the custom value
- **And** values outside the range should be rejected with an error message

### Requirement: Task Name Input
The timer SHALL allow users to name their focus task.

#### Scenario: Entering a Task Name
- **Given** the timer is in idle state
- **When** the user enters a task name
- **Then** the task name should be displayed above the timer
- **And** the name should be saved with the session

#### Scenario: Default Task Name
- **Given** the timer is in idle state
- **When** the user does not enter a task name
- **Then** a default name "Focus Session" should be used

### Requirement: Ambient Sound Selection
The timer SHALL provide ambient sound options during focus sessions.

#### Scenario: Selecting an Ambient Sound
- **Given** the timer is in idle or running state
- **When** the user selects a sound from the dropdown
- **Then** the sound should start playing immediately (if timer is running)
- **And** the sound should loop continuously
- **Options**: Off, Rain, Forest, Ocean Waves, Lo-fi Beats, White Noise, Fireplace

#### Scenario: Turning Off Sound
- **Given** an ambient sound is playing
- **When** the user selects "Off"
- **Then** the sound should stop immediately

### Requirement: Timer Controls
The timer SHALL provide start, pause, resume, and reset controls.

#### Scenario: Starting the Timer
- **Given** the timer is in idle state with a duration set
- **When** the user clicks "Start"
- **Then** the timer should begin counting down
- **And** the button should change to "Pause"
- **And** ambient sound should start playing (if selected)

#### Scenario: Pausing the Timer
- **Given** the timer is running
- **When** the user clicks "Pause"
- **Then** the timer should pause at the current time
- **And** the button should change to "Resume"
- **And** the pause count should increment by 1
- **And** ambient sound should pause

#### Scenario: Resuming the Timer
- **Given** the timer is paused
- **When** the user clicks "Resume"
- **Then** the timer should continue from where it stopped
- **And** the button should change to "Pause"
- **And** ambient sound should resume

#### Scenario: Resetting the Timer
- **Given** the timer is in any non-idle state
- **When** the user clicks "Reset"
- **Then** the timer should return to idle state with original duration
- **And** pause count should reset to 0
- **And** a confirmation dialog should appear if timer was running

### Requirement: Timer Completion
The timer SHALL handle session completion and calculate focus score.

#### Scenario: Completing a Session
- **Given** the timer is running
- **When** the countdown reaches 0
- **Then** the timer should stop
- **And** a completion animation should play
- **And** the focus score should be calculated and displayed
- **And** the session should be saved to the database
- **And** ambient sound should stop

#### Scenario: Stopping Early
- **Given** the timer is running
- **When** the user clicks "Stop" (or Reset and confirms)
- **Then** the session should be marked as interrupted
- **And** focus score should apply the early stop penalty
- **And** the session should still be saved

### Requirement: Focus Score Calculation
The timer SHALL calculate a focus score based on pauses and completion.

#### Scenario: Perfect Focus Score
- **Given** a session with 0 pauses
- **When** the timer completes fully
- **Then** the focus score should be 100%

#### Scenario: Paused Session Score
- **Given** a session with N pauses
- **When** the timer completes
- **Then** the focus score should decrease by 10% for the 1st pause
- **And** decrease by an additional 15% for the 2nd pause
- **And** decrease by an additional 20% for the 3rd pause (escalating)

#### Scenario: Early Stop Penalty
- **Given** a session stopped before 50% completion
- **When** the score is calculated
- **Then** an additional 20% penalty should be applied

#### Scenario: Minimum Score
- **Given** many pauses and early stop
- **When** the score is calculated
- **Then** the minimum score should be 0% (never negative)

### Requirement: Visual Timer Display
The timer SHALL display time remaining in a clear, visually appealing format.

#### Scenario: Timer Display
- **Given** the timer is running
- **When** the display updates
- **Then** time should be shown in MM:SS format
- **And** a circular progress ring should indicate progress
- **And** the progress ring should fill with sage color (`#C5C9A4`)
