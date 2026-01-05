## ADDED Requirements

### Requirement: Live Analytics Data
The system SHALL display analytics based on the authenticated user's actual session data from the database.

#### Scenario: Overview tab shows real session distribution
- **WHEN** a user views the Overview tab
- **THEN** the pie chart displays actual session type counts (Timer/Bento/Routine)
- **AND** the focus score reflects the user's average from recent sessions
- **AND** the streak shows the current calculated streak

#### Scenario: Insights tab shows calculated metrics
- **WHEN** a user views the Insights tab
- **THEN** the focus score trend compares current week to previous week
- **AND** peak performance shows the best-performing time window
- **AND** focus sweet spot shows the optimal session duration

#### Scenario: Awards tab shows earned achievements
- **WHEN** a user views the Awards tab
- **THEN** unlocked awards are highlighted based on UserAward records
- **AND** next award progress reflects actual session counts

#### Scenario: History tab shows session log
- **WHEN** a user views the History tab
- **THEN** recent sessions are fetched from the database
- **AND** pagination allows viewing last 25/50/100 sessions

### Requirement: Session Persistence
The system SHALL save completed focus sessions differently based on authentication status.

#### Scenario: Authenticated timer session saves to database
- **WHEN** a logged-in user completes a Timer session
- **THEN** the system calls createSession() with the user's ID
- **AND** updates UserStats with new totals

#### Scenario: Guest timer session saves locally
- **WHEN** a guest user completes a Timer session
- **THEN** the system saves the session to localStorage
- **AND** displays a prompt to sign in to save permanently

#### Scenario: Bento session saves all three tasks
- **WHEN** a logged-in user completes a Focus Box (Bento) session
- **THEN** the system calls createBentoSession() with all three task results
- **AND** groups them with a shared bentoSessionId

#### Scenario: Sync local sessions on sign-in
- **WHEN** a user signs in and has sessions in localStorage
- **THEN** the system uploads local sessions to the database
- **AND** clears localStorage after successful sync

### Requirement: Analytics Empty States
The system SHALL display meaningful empty states when the user has no session data.

#### Scenario: New user with no sessions
- **WHEN** a user with zero sessions views Analytics
- **THEN** the Overview tab shows "Complete your first session to see stats"
- **AND** the History tab shows "No sessions yet"

#### Scenario: Insufficient data for insights
- **WHEN** a user has fewer than 5 sessions
- **THEN** the Insights tab shows partial data with "Need more sessions for full insights"
