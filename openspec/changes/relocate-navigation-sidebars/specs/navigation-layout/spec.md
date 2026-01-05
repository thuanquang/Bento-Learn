## ADDED Requirements

### Requirement: Left Sidebar Navigation
The system SHALL display main navigation (Analytics, Timer, Focus Box, Profile) in a vertical left sidebar on desktop and tablet viewports.

#### Scenario: Desktop full sidebar
- **WHEN** viewport width is ≥1024px
- **THEN** left sidebar displays with icons and text labels
- **AND** sidebar width is 200px
- **AND** active navigation item shows highlighted indicator

#### Scenario: Tablet collapsed sidebar
- **WHEN** viewport width is between 768px and 1023px
- **THEN** left sidebar displays icons only (no labels)
- **AND** sidebar width is 64px
- **AND** hovering over an icon shows a tooltip with the label

#### Scenario: Mobile bottom navigation fallback
- **WHEN** viewport width is <768px
- **THEN** left sidebar is hidden
- **AND** bottom navigation bar is displayed instead
- **AND** bottom navigation maintains existing horizontal layout

---

### Requirement: Right Sidebar Navigation
The system SHALL display contextual sub-navigation in a vertical right sidebar when applicable.

#### Scenario: Analytics page right sidebar on desktop
- **WHEN** user is on Analytics page
- **AND** viewport width is ≥1024px
- **THEN** right sidebar displays Overview, Insights, Awards, History tabs
- **AND** sidebar width is 180px
- **AND** tabs show icons and text labels

#### Scenario: Analytics page collapsed right sidebar on tablet
- **WHEN** user is on Analytics page
- **AND** viewport width is between 768px and 1023px
- **THEN** right sidebar displays icons only
- **AND** sidebar width is 64px

#### Scenario: Analytics page horizontal tabs on mobile
- **WHEN** user is on Analytics page
- **AND** viewport width is <768px
- **THEN** right sidebar is hidden
- **AND** horizontal tab bar appears at top of content area

#### Scenario: Non-analytics pages have no right sidebar
- **WHEN** user is on Timer, Focus Box, or Profile page
- **THEN** no right sidebar is displayed
- **AND** main content area expands to fill available width

---

### Requirement: Responsive Layout Grid
The system SHALL use a responsive CSS grid layout to position sidebars and main content.

#### Scenario: Three-column layout on desktop
- **WHEN** viewport width is ≥1024px
- **THEN** layout displays as: left sidebar (200px) | main content (fluid) | right sidebar (180px or 0)
- **AND** main content is centered and readable

#### Scenario: Narrow sidebars on tablet
- **WHEN** viewport width is between 768px and 1023px
- **THEN** layout displays as: left sidebar (64px) | main content (fluid) | right sidebar (64px or 0)

#### Scenario: Full-width content on mobile
- **WHEN** viewport width is <768px
- **THEN** main content spans full width
- **AND** bottom navigation is fixed at bottom
- **AND** content has bottom padding to avoid overlap with bottom nav

---

### Requirement: Navigation Animations
The system SHALL animate navigation interactions using existing motion patterns.

#### Scenario: Active indicator animation
- **WHEN** user clicks a navigation item
- **THEN** active indicator slides to the new position using spring transition
- **AND** animation uses existing `springTransition` from `lib/motion.ts`

#### Scenario: Reduced motion preference
- **WHEN** user has `prefers-reduced-motion: reduce` enabled
- **THEN** no animations are applied to navigation transitions
- **AND** state changes are instant

---

### Requirement: Navigation Accessibility
The system SHALL ensure navigation is accessible to keyboard and screen reader users.

#### Scenario: Keyboard navigation
- **WHEN** user presses Tab key
- **THEN** focus moves through navigation items in order
- **AND** focused item has visible focus indicator

#### Scenario: Screen reader labels
- **WHEN** screen reader encounters navigation
- **THEN** `nav` element has appropriate `aria-label`
- **AND** active item has `aria-current="page"`
- **AND** collapsed icon items have `aria-label` matching full label text
