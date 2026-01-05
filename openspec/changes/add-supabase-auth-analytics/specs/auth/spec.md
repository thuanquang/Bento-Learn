## ADDED Requirements

### Requirement: User Authentication
The system SHALL provide user authentication via Supabase Auth supporting email/password and optional OAuth providers.

#### Scenario: Email/password sign up
- **WHEN** a user submits valid email and password on the signup page
- **THEN** the system creates a Supabase auth user
- **AND** syncs the user to the Prisma User table
- **AND** redirects to the Timer page

#### Scenario: Email/password sign in
- **WHEN** a user submits valid credentials on the login page
- **THEN** the system authenticates via Supabase
- **AND** establishes a session
- **AND** redirects to the Timer page

#### Scenario: Sign out
- **WHEN** an authenticated user clicks the sign out button
- **THEN** the system clears the Supabase session
- **AND** redirects to the login page

#### Scenario: Invalid credentials
- **WHEN** a user submits invalid credentials
- **THEN** the system displays an error message
- **AND** does not authenticate

### Requirement: Auth State Management
The system SHALL provide app-wide authentication state via React Context.

#### Scenario: Auth context provides user data
- **WHEN** a component uses the useAuth hook
- **THEN** it receives the current user, loading state, and auth methods

#### Scenario: Auth state persists across page navigation
- **WHEN** an authenticated user navigates between pages
- **THEN** the auth state remains valid without re-authentication

### Requirement: Protected Routes
The system SHALL protect authenticated-only routes via Next.js middleware while allowing guest access to Timer and Focus Box.

#### Scenario: Unauthenticated access to analytics or profile
- **WHEN** an unauthenticated user navigates to /analytics or /profile
- **THEN** the system redirects to /auth/login

#### Scenario: Guest access to timer and focus-box
- **WHEN** an unauthenticated user navigates to /timer or /focus-box
- **THEN** the system allows access (guest mode)
- **AND** sessions are stored in localStorage only

#### Scenario: Authenticated access to auth pages
- **WHEN** an authenticated user navigates to /auth/login or /auth/signup
- **THEN** the system redirects to /timer

### Requirement: User Sync to Prisma
The system SHALL synchronize Supabase auth users to the Prisma User table.

#### Scenario: First sign in creates Prisma user
- **WHEN** a user signs in for the first time
- **THEN** the system creates a corresponding User record in Prisma
- **AND** initializes UserStats with default values

#### Scenario: Subsequent sign ins use existing user
- **WHEN** a returning user signs in
- **THEN** the system uses the existing Prisma User record
