## 1. Create Navigation Components

- [x] 1.1 Create `components/navigation/side-nav.tsx` with left sidebar navigation
  - Vertical icon+label layout for main nav items
  - Responsive: full at ≥1024px, icons-only at 768-1023px, hidden at <768px
  - Use existing motion patterns and Bento color palette
  - Active indicator animation using `layoutId`

- [x] 1.2 Create `components/navigation/right-sidebar.tsx` for contextual navigation
  - Generic component that accepts nav items as props
  - Same responsive breakpoints as left sidebar
  - Used by Analytics page for Overview/Insights/Awards/History tabs

- [x] 1.3 Create `components/navigation/navigation.module.css` for shared navigation styles
  - CSS variables for sidebar widths
  - Media query breakpoints
  - Shared hover/active states

## 2. Update Main Layout

- [x] 2.1 Modify `app/(main)/layout.tsx` to use new layout structure
  - CSS Grid with named areas: `sidebar-left | main | sidebar-right`
  - Conditionally render SideNav (desktop/tablet) or BottomNav (mobile)
  - Reserve space for right sidebar when present

- [x] 2.2 Update main content area padding to account for sidebars
  - Remove bottom padding on desktop/tablet
  - Add left padding equal to sidebar width
  - Responsive adjustments at each breakpoint

## 3. Refactor Analytics Page

- [x] 3.1 Extract tab navigation from Analytics page to use RightSidebar
  - Pass tab items to RightSidebar component
  - Handle tab state in parent, pass active state down
  - Keep horizontal tabs as mobile fallback inside content area

- [x] 3.2 Update `analytics.module.css` for new layout
  - Remove top tab navigation styles (moved to sidebar)
  - Add mobile horizontal tab styles
  - Ensure content fills available space

## 4. Mobile Fallback

- [x] 4.1 Keep BottomNav component for mobile (<768px)
  - Show/hide based on media query or viewport width
  - Use CSS `display: none` on desktop/tablet

- [x] 4.2 Add mobile horizontal tabs for analytics sub-navigation
  - Rendered inside Analytics page content area on mobile
  - Hidden on desktop/tablet when right sidebar is visible

## 5. Polish & Accessibility

- [x] 5.1 Add tooltip on hover for collapsed sidebar icons
  - Show label text on hover when sidebar is in icons-only mode
  - Use CSS or simple tooltip component

- [x] 5.2 Ensure proper ARIA labels on navigation elements
  - `aria-label` on nav elements
  - `aria-current="page"` on active items

- [x] 5.3 Test `prefers-reduced-motion` behavior
  - Verify no animations when user prefers reduced motion
  - Use existing `usePrefersReducedMotion` hook

## 6. Validation

- [x] 6.1 Test on desktop (≥1024px): full sidebars visible
- [x] 6.2 Test on tablet (768-1023px): collapsed icons-only sidebars
- [x] 6.3 Test on mobile (<768px): bottom nav + horizontal tabs
- [x] 6.4 Run `npm run build` to verify no compilation errors
- [x] 6.5 Run `npm run lint` to check for linting issues
