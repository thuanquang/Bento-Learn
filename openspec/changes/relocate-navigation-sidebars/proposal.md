# Change: Relocate Navigation to Side Panels

## Why
The current bottom navigation design limits content space and doesn't fully utilize screen width on larger displays. Moving navigation to the sides improves content focus and provides a more desktop-friendly layout while maintaining mobile usability through responsive breakpoints.

## What Changes
- **Left Sidebar**: Main navigation (Analytics, Timer, Focus Box, Profile) moves from bottom to a vertical left sidebar
  - Desktop: Full sidebar with icons and labels
  - Tablet: Icons-only collapsed sidebar
  - Mobile: Falls back to bottom navigation bar
- **Right Sidebar**: Analytics page sub-navigation (Overview, Insights, Awards, History) moves to the right side
  - Desktop: Full sidebar with icons and labels
  - Tablet: Icons-only collapsed sidebar  
  - Mobile: Horizontal tab bar below main content area
- **Layout System**: New responsive 3-column layout (left sidebar | main content | optional right sidebar)

## Impact
- Affected specs: `bento-layout` (new navigation-layout capability)
- Affected code:
  - `components/navigation/bottom-nav.tsx` → `components/navigation/side-nav.tsx`
  - `app/(main)/layout.tsx` - Updated layout structure
  - `app/(main)/analytics/page.tsx` - Extract tab navigation to right sidebar
  - `app/(main)/analytics/analytics.module.css` - Update styles
  - New: `components/navigation/right-sidebar.tsx`
  - New: `components/navigation/navigation.module.css`
