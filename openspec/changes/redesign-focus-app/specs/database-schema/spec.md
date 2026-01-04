# database-schema Specification

## Purpose
Define the complete database schema for the focus timer application, replacing all existing models with Session, UserAward, and UserStats.

## REMOVED Requirements

### Requirement: Resource Hierarchy Support
*REMOVED* - The old Resource model with MACRO/MESO/MICRO tiers is no longer needed.

### Requirement: Consistency Tracking via StudyLog
*REMOVED* - Replaced by Session model with focus scoring.

## ADDED Requirements

### Requirement: Session Tracking
The database SHALL track all focus sessions with type, duration, pauses, and focus score.

#### Scenario: Creating a Timer Session
- **Given** a user completes a single-task timer
- **When** the session is saved
- **Then** a Session record should be created with `type: TIMER`
- **And** it should store `taskName`, `durationPlanned`, `durationActual`, `pauseCount`, `focusScore`
- **And** `bentoSessionId` and `bentoTaskIndex` should be null

#### Scenario: Creating a Bento Session
- **Given** a user completes a 3-task Focus Box session
- **When** the session is saved
- **Then** 3 Session records should be created with `type: BENTO`
- **And** all 3 should share the same `bentoSessionId`
- **And** they should have `bentoTaskIndex` values of 0, 1, 2

#### Scenario: Creating a Routine Session
- **Given** a user completes a scheduled routine session
- **When** the session is saved
- **Then** a Session record should be created with `type: ROUTINE`

### Requirement: Award Tracking
The database SHALL track which awards a user has unlocked.

#### Scenario: Unlocking an Award
- **Given** a user meets an award threshold
- **When** the award is unlocked
- **Then** a UserAward record should be created with `awardType` and `unlockedAt`
- **And** duplicate awards should not be allowed (unique constraint on userId + awardType)

### Requirement: User Statistics
The database SHALL maintain aggregated user statistics for efficient querying.

#### Scenario: Tracking Streak Data
- **Given** a user completes a session
- **When** the stats are updated
- **Then** `currentStreak` should increment if `lastActiveDate` was yesterday
- **And** `longestStreak` should update if `currentStreak` exceeds it
- **And** `lastActiveDate` should be set to today

#### Scenario: Tracking Session Totals
- **Given** a user completes a session
- **When** the stats are updated
- **Then** `totalSessions` should increment by 1
- **And** `totalFocusMinutes` should increment by `durationActual / 60`
- **And** `perfectScoreCount` should increment if `focusScore === 100`
- **And** `noPauseSessionCount` should increment if `pauseCount === 0`

### Requirement: Session Type Enum
The database SHALL define session types as an enum.

#### Scenario: Session Type Values
- **Given** the schema is defined
- **When** the SessionType enum is referenced
- **Then** it should contain values: `TIMER`, `BENTO`, `ROUTINE`

### Requirement: Award Type Enum
The database SHALL define all possible awards as an enum.

#### Scenario: Award Type Values
- **Given** the schema is defined
- **When** the AwardType enum is referenced
- **Then** it should contain the following values:
  - Focus Mastery: `TASK_STARTER`, `PERFECT_FOCUS`, `FOCUS_CHAMPION`, `STEADY_PERFORMER`
  - ADHD Superpowers: `TIMER_SPECIALIST`, `COMEBACK_CHAMPION`, `ZEN_MASTER`, `NO_PAUSE_PRO`
  - Consistency Builder: `BENTO_MASTER`, `ROUTINE_CHAMPION`, `ROUTINE_BUILDER`, `PERSISTENCE_MASTER`
