# Focus Actions Logic Spec

## ADDED Requirements
### Requirement: Single Macro Constraint
The system SHALL strictly limit users to a single active "Macro" focus at any given time.

#### Scenario: Enforcing Single Macro Constraint
- **Given** a user already has an `ACTIVE` Macro resource
- **When** they try to create a new Resource with `tier=MACRO`
- **Then** the server action should fail with an error: "Finish your main focus first."
- **And** no new record should be created in the database.

### Requirement: Progress Persistence
The system SHALL persist all progress updates immediately and reliably.

#### Scenario: Updating Progress
- **Given** an active resource
- **When** the user clicks the increment button
- **Then** the `progress` value should update in the database.
- **And** a corresponding `StudyLog` entry should be created.
- **And** the UI should update optimistically.
