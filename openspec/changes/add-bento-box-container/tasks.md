# Tasks: Add Bento Box Container

## 1. Foundation
- [x] 1.1 Create `lib/box-theme-context.tsx` with BoxThemeProvider and useBoxTheme hook
- [x] 1.2 Define `BentoBoxDesign` interface and box design registry in `lib/box-designs.tsx`
- [x] 1.3 Add `selectedBoxDesign` field to UserStats in `prisma/schema.prisma`
- [x] 1.4 Run database migration for new field

## 2. Default Box Design
- [x] 2.1 Create `components/bento-container/` directory structure
- [x] 2.2 Implement `WoodenBox.tsx` - default wooden bento box design (top-down view)
- [x] 2.3 Implement `WoodenLid.tsx` - matching wooden lid component
- [x] 2.4 Create `bento-container.module.css` with base box styles
- [x] 2.5 Register WoodenBox as default design in box-designs registry

## 3. Container Component
- [x] 3.1 Create `BentoBoxContainer.tsx` wrapper component
- [x] 3.2 Implement content measurement using ResizeObserver
- [x] 3.3 Add centered layout with flexbox/grid
- [x] 3.4 Integrate with BoxThemeContext to render selected box design

## 4. Navigation Animations
- [x] 4.1 Detect navigation events using Next.js router events or pathname changes
- [x] 4.2 Implement close-lid animation phase (300ms, lid slides over box)
- [x] 4.3 Implement resize-box animation phase (400ms, dimensions animate)
- [x] 4.4 Implement open-lid animation phase (300ms, lid slides off and fades)
- [x] 4.5 Add loading state management (loading starts after lid closes)
- [x] 4.6 Add `prefers-reduced-motion` fallback (instant transitions)

## 5. Layout Integration
- [x] 5.1 Update `app/(main)/layout.tsx` to wrap children with BentoBoxContainer
- [x] 5.2 Update `app/(main)/layout.module.css` for centered container positioning
- [x] 5.3 Ensure FloatingChopsticksNav remains outside the bento box
- [ ] 5.4 Test on all 4 pages (Analytics, Timer, Focus Box, Profile)

## 6. Unlock System
- [x] 6.1 Define unlock criteria for 2-3 additional box designs (tied to awards or sessions)
- [x] 6.2 Create placeholder box designs (e.g., BambooBox, LacqueredBox)
- [x] 6.3 Implement `getUnlockedBoxDesigns(userId)` function
- [x] 6.4 Connect unlock checks to existing awards/UserStats data

## 7. Profile Box Selector
- [x] 7.1 Create `BoxSelector.tsx` component for Profile page
- [x] 7.2 Display grid of box designs (locked/unlocked states)
- [x] 7.3 Implement box selection with visual feedback
- [x] 7.4 Add API endpoint `PATCH /api/profile` to save selected box
- [x] 7.5 Integrate BoxSelector into Profile page as new section
- [x] 7.6 Load user's saved box preference on app load

## 8. Theming Foundation
- [x] 8.1 Add optional `colorPalette` to BentoBoxDesign interface
- [x] 8.2 Expose `activeColorPalette` from BoxThemeContext (null for now)
- [x] 8.3 Document theming extension points for future development

## 9. Testing & Polish
- [ ] 9.1 Test navigation transitions on desktop viewport
- [ ] 9.2 Test navigation transitions on tablet viewport
- [ ] 9.3 Test navigation transitions on mobile viewport
- [ ] 9.4 Verify reduced motion behavior
- [ ] 9.5 Test box selection persistence across sessions
- [x] 9.6 Run `npm run build` to verify no compilation errors
