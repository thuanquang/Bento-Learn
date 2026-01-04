# design-system Specification

## Purpose
Define the visual design system including color palette, typography, spacing, and component styles for the soft minimalistic bento aesthetic.

## ADDED Requirements

### Requirement: Color Palette
The design system SHALL use a curated bento-grid color palette.

#### Scenario: Color Token Definition
- **Given** the application CSS is loaded
- **When** components reference color tokens
- **Then** the following colors should be available:
  - `--color-sage`: `#C5C9A4` (primary backgrounds, main cards)
  - `--color-sage-muted`: `#B5C4A8` (secondary cards, hover states)
  - `--color-brown`: `#7A6052` (accents, secondary buttons)
  - `--color-peach`: `#D4A27C` (highlights, awards, CTAs)
  - `--color-charcoal`: `#3A3A3A` (text, dark UI elements)
  - `--color-cream`: `#F8F8F8` (light backgrounds)

#### Scenario: Semantic Color Tokens
- **Given** the design system
- **When** semantic colors are used
- **Then** mappings should be:
  - `--color-background`: `var(--color-cream)`
  - `--color-surface`: `#FFFFFF`
  - `--color-primary`: `var(--color-sage)`
  - `--color-accent`: `var(--color-peach)`
  - `--color-text`: `var(--color-charcoal)`
  - `--color-text-muted`: `#6B6B6B`

### Requirement: Typography
The design system SHALL use consistent typography.

#### Scenario: Font Family
- **Given** the application loads
- **When** text renders
- **Then** the font should be Inter from Google Fonts
- **And** a fallback of system sans-serif should be defined

#### Scenario: Font Weights
- **Given** the typography system
- **When** weights are used
- **Then** headings should use weight 600 (semibold)
- **And** body text should use weight 400 (regular)
- **And** emphasis should use weight 500 (medium)

#### Scenario: Font Sizes
- **Given** the typography scale
- **When** sizes are applied
- **Then** the scale should be: 12, 14, 16, 20, 24, 32, 48px
- **And** line heights should be appropriately set for readability

### Requirement: Border Radius
The design system SHALL use consistent border radius for soft aesthetics.

#### Scenario: Radius Tokens
- **Given** components with rounded corners
- **When** radius is applied
- **Then** `--radius-sm`: 8px (small elements, buttons)
- **And** `--radius-md`: 12px (cards, inputs)
- **And** `--radius-lg`: 20px (large cards, modals)
- **And** `--radius-full`: 9999px (pills, avatars)

### Requirement: Shadows
The design system SHALL use subtle shadows for depth.

#### Scenario: Shadow Tokens
- **Given** elevated components
- **When** shadows are applied
- **Then** `--shadow-subtle`: `0 2px 8px rgba(58, 58, 58, 0.08)`
- **And** `--shadow-medium`: `0 4px 16px rgba(58, 58, 58, 0.12)`
- **And** `--shadow-large`: `0 8px 32px rgba(58, 58, 58, 0.16)`

### Requirement: Animation
The design system SHALL define consistent animation timing.

#### Scenario: Animation Tokens
- **Given** animated elements
- **When** transitions occur
- **Then** easing should be `cubic-bezier(0.4, 0, 0.2, 1)`
- **And** micro interactions: 150ms
- **And** standard transitions: 300ms
- **And** emphasis animations: 500ms

### Requirement: Component Base Styles
The design system SHALL provide base component styles.

#### Scenario: Button Styles
- **Given** a primary button
- **When** it renders
- **Then** it should have:
  - Background: `var(--color-sage)` (primary) or `var(--color-peach)` (accent)
  - Text: `var(--color-charcoal)`
  - Padding: 12px 24px
  - Border radius: `var(--radius-sm)`
  - Hover: slight darkening or scale effect

#### Scenario: Card Styles
- **Given** a card component
- **When** it renders
- **Then** it should have:
  - Background: `var(--color-surface)` or `var(--color-sage)`
  - Shadow: `var(--shadow-subtle)`
  - Border radius: `var(--radius-md)`
  - Padding: 16px or 24px

#### Scenario: Input Styles
- **Given** an input field
- **When** it renders
- **Then** it should have:
  - Border: 1px solid `var(--color-sage-muted)`
  - Border radius: `var(--radius-sm)`
  - Focus: ring using `var(--color-sage)`
  - Background: `var(--color-surface)`

### Requirement: Bento Grid Layout
The design system SHALL define a bento-style grid system.

#### Scenario: Grid Definition
- **Given** a bento layout
- **When** it renders
- **Then** it should support mixed cell sizes
- **And** gaps should be consistent (16px default)
- **And** cards should maintain the soft aesthetic
