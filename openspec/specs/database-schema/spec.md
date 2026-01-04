# database-schema Specification

## Purpose
TBD - created by archiving change implement-bento-core. Update Purpose after archive.
## Requirements
### Requirement: Resource Hierarchy Support
The database SHALL support a tiered referencing system for goals.

#### Scenario: Defining the Resource Hierarchy
- **Given** a user wants to track specific goals
- **When** the schema is migrated
- **Then** the `Resource` table should exist with a `tier` enum (`MACRO`, `MESO`, `MICRO`).
- **And** it should track `progress` (Int), `goal` (Int), and `unit` (String).
- **And** it should have a `status` enum (`ACTIVE`, `COMPLETED`).

### Requirement: Consistency Tracking
The database SHALL track the history of all study progress.

#### Scenario: Tracking Consistency
- **Given** a user makes progress
- **When** an action is performed
- **Then** a `StudyLog` entry should be linked to the `Resource` and `User`.
- **And** it should record the `date` and `amount` of progress.

