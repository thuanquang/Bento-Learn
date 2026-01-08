# Change: Add Bento Box Container with Navigation Animations

## Why
The app's main content area currently lacks visual cohesion with the "Bento" theme. Wrapping all pages in an animated bento box container (top-down view) will create a delightful, immersive experience where navigation transitions feel like opening and closing a physical bento box. This feature also establishes the foundation for unlockable box designs and future theming.

## What Changes
- **New BentoBoxContainer component**: Wraps the main content area in a visual bento box (top-down wooden box style)
- **Framer Motion animations**: Use Framer Motion extensively for all animations:
  - Lid close/open transitions with `motion.div` and custom variants
  - Box resize animations using `layout` prop and `AnimatePresence`
  - Smooth easing curves and spring physics for premium feel
- **Lid animation on navigation**: When navigating between pages, the lid closes → box resizes → lid opens
- **Dynamic sizing**: The box animates to fit the content dimensions of the target page
- **Centered layout**: All bento boxes are centered on screen
- **Unlockable box designs**: Create a modular system to unlock new box styles tied to the progress/awards system
- **Profile box selector**: New section in Profile page to view and select unlocked box designs
- **Theming foundation**: Architecture supports future color theming where page components match selected box style

## Impact
- Affected specs: NEW `bento-container`, NEW `theming-system`
- Affected code:
  - `app/(main)/layout.tsx` - Wrap children with BentoBoxContainer
  - `components/bento-container/` - New component directory
  - `lib/box-theme-context.tsx` - New context for box selection and theming
  - `app/(main)/profile/page.tsx` - Add box selector section
  - `prisma/schema.prisma` - Add box design preferences to UserStats
