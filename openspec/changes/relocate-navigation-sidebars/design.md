## Context
The application currently uses a fixed bottom navigation bar for the 4 main pages and a horizontal tab bar within the Analytics page for sub-navigation. This works for mobile but doesn't optimize for larger screens.

### Stakeholders
- End users on desktop, tablet, and mobile devices
- Developers maintaining navigation components

## Goals / Non-Goals

### Goals
- Create a responsive navigation system that adapts to screen size
- Maximize content area on all device sizes
- Maintain the soft, minimalistic aesthetic
- Keep navigation accessible and intuitive
- Ensure smooth transitions between breakpoints

### Non-Goals
- Changing the navigation items themselves (4 main pages, 4 analytics tabs)
- Adding new navigation features (e.g., breadcrumbs, nested menus)
- Changing the color scheme or animation patterns

## Decisions

### Breakpoint Strategy
- **Desktop (≥1024px)**: Full sidebars with icons + labels
- **Tablet (768px - 1023px)**: Collapsed sidebars (icons only)
- **Mobile (<768px)**: Bottom nav for main navigation, horizontal tabs for analytics

**Rationale**: These breakpoints align with common device sizes and provide natural transition points for the UI.

### Sidebar Width
- Full sidebar: 200px (left), 180px (right)
- Collapsed sidebar: 64px
- Bottom nav height: 72px (unchanged)

**Rationale**: 200px provides comfortable reading of labels while 64px fits icons with padding.

### Animation Approach
- Use existing Framer Motion patterns from `lib/motion.ts`
- Sidebar entry: slide in from respective side
- Active indicator: layout animation (existing `layoutId` pattern)
- No animation for breakpoint switches (instant CSS-based)

**Alternatives considered**:
- Animated breakpoint transitions: Rejected due to performance concerns and potential jarring experience

### Component Architecture
```
MainLayout
├── SideNav (left, main navigation)
├── Main Content
│   └── Page Content
│       └── RightSidebar (context-specific, e.g., analytics tabs)
└── BottomNav (mobile fallback)
```

**Rationale**: SideNav is always present, RightSidebar is optional and page-specific. This avoids layout shift when navigating between pages with/without right sidebar.

### Right Sidebar Behavior
The right sidebar only appears on the Analytics page. Other pages (Timer, Focus Box, Profile) will have full-width content.

**Implementation**: Analytics page will render RightSidebar as part of its content, positioned absolutely or using CSS grid.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Content jumping when right sidebar appears | Use CSS grid with named areas; sidebar presence doesn't affect main content width |
| Mobile users expecting bottom nav | Keep bottom nav as default for mobile; only change desktop |
| Accessibility concerns with collapsed icons | Add tooltips on hover, maintain proper ARIA labels |
| Animation performance on older devices | Use CSS transforms, respect `prefers-reduced-motion` |

## Migration Plan
1. Create new navigation components alongside existing ones
2. Update layout to use new components
3. Extract analytics tabs to right sidebar
4. Test across all breakpoints
5. Remove deprecated bottom-nav code (or keep as mobile fallback)

## Open Questions
- None at this time; requirements are clear
