# focus-box Specification

## Purpose
Define the Bento Focus Box functionality that allows users to queue and complete 3 sequential focus tasks with customizable names and durations.

## ADDED Requirements

### Requirement: 3-Task Bento Queue
The Focus Box SHALL allow users to configure exactly 3 tasks before starting a session.

#### Scenario: Viewing Empty Bento Box
- **Given** the user visits the Focus Box page
- **When** no tasks are configured
- **Then** 3 empty task slots should be displayed in a bento grid layout
- **And** each slot should have a placeholder prompting task entry

#### Scenario: Configuring a Task
- **Given** an empty task slot
- **When** the user clicks on it
- **Then** they should be able to enter a task name
- **And** they should be able to select a duration (5-60 minutes)

#### Scenario: All Tasks Required
- **Given** the Focus Box with fewer than 3 tasks configured
- **When** the user clicks "Start Focus"
- **Then** an error message should indicate all 3 tasks are required

### Requirement: Task Reordering
The Focus Box SHALL allow users to reorder tasks before starting.

#### Scenario: Drag to Reorder
- **Given** 3 configured tasks
- **When** the user drags a task to a different position
- **Then** the tasks should reorder accordingly
- **And** the visual order should update immediately

#### Scenario: Order Persistence
- **Given** reordered tasks
- **When** the session starts
- **Then** tasks should run in the displayed order (index 0, 1, 2)

### Requirement: Sequential Task Execution
The Focus Box SHALL run tasks sequentially with intermissions between them.

#### Scenario: Starting a Bento Session
- **Given** 3 configured tasks
- **When** the user clicks "Start Focus"
- **Then** the first task timer should begin
- **And** the UI should show current task (1 of 3)
- **And** a unique `bentoSessionId` should be generated

#### Scenario: Completing a Task
- **Given** the current task timer completes
- **When** the completion is detected
- **Then** an intermission screen should appear
- **And** it should show "Task complete! Ready for next task?"
- **And** the next task name and duration should be previewed

#### Scenario: Continuing to Next Task
- **Given** the intermission screen is showing
- **When** the user clicks "Continue"
- **Then** the next task timer should begin
- **And** the UI should update to show current task (2 of 3 or 3 of 3)

#### Scenario: Completing All Tasks
- **Given** the third task timer completes
- **When** the final intermission would appear
- **Then** a session summary should show instead
- **And** it should display total focus time
- **And** it should display aggregate focus score

### Requirement: Early Session Exit
The Focus Box SHALL allow users to end a session early.

#### Scenario: Ending During a Task
- **Given** a task timer is running
- **When** the user clicks "End Session"
- **Then** a confirmation dialog should appear
- **And** if confirmed, the current task should be saved with early stop penalty
- **And** the session should end without running remaining tasks

#### Scenario: Ending During Intermission
- **Given** the intermission screen is showing
- **When** the user clicks "End Session"
- **Then** completed tasks should be saved
- **And** remaining tasks should not be recorded
- **And** the user should return to the Focus Box configuration

### Requirement: Bento Session Recording
The Focus Box SHALL record each task as a separate Session with shared grouping.

#### Scenario: Session Records Created
- **Given** a completed 3-task bento session
- **When** the sessions are saved
- **Then** 3 Session records should be created
- **And** all should have `type: BENTO`
- **And** all should share the same `bentoSessionId`
- **And** they should have `bentoTaskIndex` of 0, 1, 2 respectively

#### Scenario: Individual Focus Scores
- **Given** a bento session with varying pause counts per task
- **When** sessions are saved
- **Then** each task should have its own `focusScore`
- **And** the summary should show average or aggregate score

### Requirement: Ambient Sound in Bento
The Focus Box SHALL support ambient sounds across all tasks.

#### Scenario: Sound Selection
- **Given** the Focus Box configuration screen
- **When** the user selects an ambient sound
- **Then** the sound should play during all 3 task timers
- **And** the sound should pause during intermissions
- **And** the sound should resume when the next task starts

### Requirement: Bento Grid Visual Layout
The Focus Box SHALL display tasks in a bento-style grid layout.

#### Scenario: Grid Layout
- **Given** 3 tasks configured
- **When** the page renders
- **Then** tasks should be displayed in a bento grid:
  - Tasks 1 and 2 side-by-side at top (smaller)
  - Task 3 spanning full width at bottom (larger)
- **And** each task card should show task name and duration
- **And** the grid should use the bento color palette
