# motion-utilities Specification

## Purpose
Shared Framer Motion utilities, variants, and components for consistent animation behavior across the app.

## ADDED Requirements

### Requirement: Shared Motion Configuration
The application SHALL provide reusable motion configuration for consistent animation behavior.

#### Scenario: Spring Transition Export
- **Given** any page component imports from `lib/motion.ts`
- **When** it uses `springTransition` or `gentleSpring`
- **Then** it should receive consistent spring physics configuration
- **And** animations should feel cohesive across the app

#### Scenario: Reduced Motion Support
- **Given** a user has `prefers-reduced-motion: reduce` set in their OS
- **When** any animation is triggered
- **Then** it should be disabled or significantly reduced
- **And** no content should be inaccessible due to the reduction

### Requirement: Reusable Animation Components
The application SHALL provide pre-built motion components for common patterns.

#### Scenario: FadeIn Component
- **Given** content wrapped in a `<FadeIn>` component
- **When** the component mounts
- **Then** the content should animate from opacity 0 to 1
- **And** it should slide up by 20px with a gentle spring

#### Scenario: StaggerContainer Component
- **Given** a list of items wrapped in `<StaggerContainer>`
- **When** the container mounts
- **Then** each child should animate in sequence with a 50ms delay between each
- **And** the total animation should not exceed 500ms for 10 items

#### Scenario: TapScale Component  
- **Given** an interactive element wrapped in `<TapScale>`
- **When** the user taps/clicks the element
- **Then** it should scale to 0.97 using spring physics
- **And** return to 1.0 on release
