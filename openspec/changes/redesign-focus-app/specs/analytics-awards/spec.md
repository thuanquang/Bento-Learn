# analytics-awards Specification

## Purpose
Define the Awards subsection of Analytics showing achievements, progress tracking, and next unlockable awards.

## ADDED Requirements

### Requirement: Next Award Display
The Awards tab SHALL prominently display the nearest-to-completion award.

#### Scenario: Next Award Rendering
- **Given** the user has unlocked some awards but not all
- **When** the Awards tab loads
- **Then** the "Your Next Award" section should display:
  - Award icon and name
  - Progress bar showing completion percentage
  - Description of what's needed (e.g., "5 more sessions to unlock")

#### Scenario: All Awards Unlocked
- **Given** the user has unlocked all 12 awards
- **When** the Awards tab loads
- **Then** a celebratory message should display
- **And** text should say "You've unlocked all awards! 🎉"

#### Scenario: No Progress Yet
- **Given** the user has no sessions
- **When** the Awards tab loads
- **Then** the next award should be "Task Starter" (first award)
- **And** description should say "Complete 5 sessions to unlock"

### Requirement: Award Categories
The Awards tab SHALL display awards organized in 3 collapsible categories.

#### Scenario: Category Display
- **Given** the Awards tab loads
- **When** categories render
- **Then** 3 categories should be displayed:
  - "Focus Mastery" with 4 awards
  - "ADHD Superpowers" with 4 awards
  - "Consistency Builder" with 4 awards
- **And** each category should be collapsible/expandable

### Requirement: Focus Mastery Awards
The Focus Mastery category SHALL contain 4 achievement awards.

#### Scenario: Task Starter Award
- **Given** a user completes 5 sessions (any type)
- **When** the award check runs
- **Then** "Task Starter" should unlock
- **Description**: "Complete 5 focus sessions"
- **Threshold**: 5 total sessions

#### Scenario: Perfect Focus Award
- **Given** a user achieves 25 sessions with 100% focus score
- **When** the award check runs
- **Then** "Perfect Focus" should unlock
- **Description**: "Achieve 25 perfect focus scores (100%)"
- **Threshold**: 25 perfect scores (tracked in UserStats.perfectScoreCount)

#### Scenario: Focus Champion Award
- **Given** a user completes 50 sessions with focus score > 90%
- **When** the award check runs
- **Then** "Focus Champion" should unlock
- **Description**: "Complete 50 sessions with over 90% focus"
- **Threshold**: 50 sessions with focusScore >= 90

#### Scenario: Steady Performer Award
- **Given** a user completes 20 sessions between 25-45 minutes
- **When** the award check runs
- **Then** "Steady Performer" should unlock
- **Description**: "Complete 20 sessions between 25-45 minutes"
- **Threshold**: 20 sessions where 25 <= durationActual/60 <= 45

### Requirement: ADHD Superpowers Awards
The ADHD Superpowers category SHALL contain 4 achievement awards.

#### Scenario: Timer Specialist Award
- **Given** a user completes 50 Timer-type sessions
- **When** the award check runs
- **Then** "Timer Specialist" should unlock
- **Description**: "Complete 50 timer sessions"
- **Threshold**: 50 sessions with type=TIMER

#### Scenario: Comeback Champion Award
- **Given** a user completes 5 sessions with 4 or more pauses
- **When** the award check runs
- **Then** "Comeback Champion" should unlock
- **Description**: "Complete 5 sessions with 4+ pauses (never give up!)"
- **Threshold**: 5 sessions with pauseCount >= 4

#### Scenario: Zen Master Award
- **Given** a user completes 20 sessions with 100% focus and 0 pauses
- **When** the award check runs
- **Then** "Zen Master" should unlock
- **Description**: "Complete 20 perfect sessions with no pauses"
- **Threshold**: 20 sessions with focusScore=100 AND pauseCount=0

#### Scenario: No-Pause Pro Award
- **Given** a user completes 30 sessions with 0 pauses
- **When** the award check runs
- **Then** "No-Pause Pro" should unlock
- **Description**: "Complete 30 sessions without pausing"
- **Threshold**: 30 sessions with pauseCount=0 (tracked in UserStats.noPauseSessionCount)

### Requirement: Consistency Builder Awards
The Consistency Builder category SHALL contain 4 achievement awards.

#### Scenario: Bento Master Award
- **Given** a user completes 25 Bento-type sessions
- **When** the award check runs
- **Then** "Bento Master" should unlock
- **Description**: "Complete 25 bento box sessions"
- **Threshold**: 25 sessions with type=BENTO (counts each task, so 9 bento boxes = 27)

#### Scenario: Routine Champion Award
- **Given** a user completes 25 Routine-type sessions
- **When** the award check runs
- **Then** "Routine Champion" should unlock
- **Description**: "Complete 25 routine sessions"
- **Threshold**: 25 sessions with type=ROUTINE

#### Scenario: Routine Builder Award
- **Given** a user has a 30-day streak
- **When** the award check runs
- **Then** "Routine Builder" should unlock
- **Description**: "Maintain a 30-day focus streak"
- **Threshold**: currentStreak >= 30 OR longestStreak >= 30

#### Scenario: Persistence Master Award
- **Given** a user completes 30 sessions with 1-3 pauses
- **When** the award check runs
- **Then** "Persistence Master" should unlock
- **Description**: "Complete 30 sessions with 1-3 pauses (persistence pays off)"
- **Threshold**: 30 sessions where 1 <= pauseCount <= 3

### Requirement: Award Card Display
Each award SHALL be displayed with consistent styling.

#### Scenario: Locked Award Display
- **Given** an award is not yet unlocked
- **When** it renders
- **Then** it should show:
  - Grayed-out icon
  - Award name and description
  - Progress bar with current/total progress
  - Muted styling (lower opacity)

#### Scenario: Unlocked Award Display
- **Given** an award is unlocked
- **When** it renders
- **Then** it should show:
  - Full-color icon with glow effect
  - Award name and description
  - "Unlocked on {date}" text
  - Gold/peach accent border
