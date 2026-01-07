# Spec: Floating Chopsticks Navigation

## ADDED Requirements

### Requirement: Floating Navigation Button
The application MUST display a floating navigation button styled as two vertical chopsticks that can be tapped to reveal the main navigation menu.

#### Scenario: Initial render displays closed chopsticks
**Given** the user loads any page in the main app  
**When** the page renders  
**Then** a floating button appears with two vertical parallel bars (chopsticks)  
**And** the button is positioned in the bottom-right corner by default  
**And** the navigation menu is hidden

#### Scenario: Tap opens the navigation scroll
**Given** the floating chopsticks button is in closed state  
**When** the user taps/clicks the button  
**Then** the left chopstick rotates -90° and moves left  
**And** the right chopstick rotates +90° and moves right  
**And** a scroll-like container expands horizontally between them  
**And** four navigation icons appear inside the scroll with stagger animation

#### Scenario: Tap closes the navigation scroll
**Given** the navigation menu is open  
**When** the user taps the chopsticks button again  
**Then** the navigation icons fade out  
**And** the scroll container collapses  
**And** the chopsticks rotate back to vertical position

---

### Requirement: Draggable Positioning
The floating navigation button MUST be draggable to allow users to position it anywhere within the viewport boundaries.

#### Scenario: User drags menu to new position
**Given** the floating navigation button is visible  
**When** the user drags the button  
**Then** the button follows the pointer/touch position smoothly  
**And** the button uses spring animation during drag

#### Scenario: Menu constrained within viewport
**Given** the user is dragging the floating button  
**When** the button reaches the edge of the viewport  
**Then** the button stops at the viewport boundary  
**And** cannot be dragged outside the visible area

#### Scenario: Menu position updates on viewport resize
**Given** the floating button is near the edge of the viewport  
**When** the viewport is resized smaller  
**Then** the button animates to stay within the new viewport boundaries

---

### Requirement: Navigation Functionality
The floating navigation menu MUST provide access to all four main application routes.

#### Scenario: Navigate to Analytics
**Given** the navigation menu is open  
**When** the user taps the Analytics icon  
**Then** the user navigates to `/analytics`  
**And** the menu closes automatically

#### Scenario: Navigate to Timer
**Given** the navigation menu is open  
**When** the user taps the Timer icon  
**Then** the user navigates to `/timer`  
**And** the menu closes automatically

#### Scenario: Navigate to Focus Box
**Given** the navigation menu is open  
**When** the user taps the Focus Box icon  
**Then** the user navigates to `/focus-box`  
**And** the menu closes automatically

#### Scenario: Navigate to Profile
**Given** the navigation menu is open  
**When** the user taps the Profile icon  
**Then** the user navigates to `/profile`  
**And** the menu closes automatically

#### Scenario: Active route is highlighted
**Given** the navigation menu is open  
**And** the user is on a specific route  
**When** viewing the navigation icons  
**Then** the icon for the current route has a distinct visual highlight

---

### Requirement: Accessibility Support
The floating navigation MUST be accessible to users with disabilities and respect motion preferences.

#### Scenario: Reduced motion preference disables animations
**Given** the user has `prefers-reduced-motion: reduce` set  
**When** interacting with the floating navigation  
**Then** all animations are disabled  
**And** state changes happen instantly

#### Scenario: Keyboard navigation
**Given** the floating button has keyboard focus  
**When** the user presses Enter or Space  
**Then** the menu toggles open/closed  
**And** when open, arrow keys navigate between items  
**And** Escape closes the menu

#### Scenario: Screen reader announces state
**Given** a screen reader is active  
**When** interacting with the floating navigation  
**Then** the button announces its expanded/collapsed state  
**And** navigation items are properly labeled

---

## MODIFIED Requirements

### Requirement: Main Layout Navigation (from bento-layout)
The main layout MUST use a floating draggable chopsticks menu as the primary navigation instead of fixed sidebars or bottom navigation bars.

#### Scenario: Desktop layout without sidebar
**Given** the user is on a desktop viewport (≥1024px)  
**When** viewing the main layout  
**Then** no side navigation bar is displayed  
**And** the floating chopsticks navigation is present

#### Scenario: Mobile layout without bottom nav
**Given** the user is on a mobile viewport (<768px)  
**When** viewing the main layout  
**Then** no fixed bottom navigation bar is displayed  
**And** the floating chopsticks navigation is present

---

## REMOVED Requirements

### Requirement: Fixed Bottom Navigation
The fixed bottom navigation bar on mobile is removed and replaced by the floating chopsticks navigation.

### Requirement: Side Navigation Bar
The fixed side navigation bar on desktop/tablet is removed and replaced by the floating chopsticks navigation.
