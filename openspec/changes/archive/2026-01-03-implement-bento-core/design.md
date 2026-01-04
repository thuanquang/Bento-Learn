# Design: Bento Learn Core Architecture

## Philosophy: Constraint-Based Productivity
The core differentiator is the **inability** to overload the dashboard. The system forces a hierarchy:
1. **Macro (Deep Work)**: Only ONE active at a time. This is the primary learning goal.
2. **Meso (Habits)**: Limited to TWO. Maintenance tasks or secondary learning.
3. **Micro (Stats)**: Visualization of consistency, not active tasks.

## Aesthetic Limit: "iOS on the Web"
- **Shape**: `rounded-3xl` for a "hardware-like" feel.
- **Color**: `bg-neutral-950` (Deep Black) with neon accents for active states.
- **Interaction**: framer-motion `whileTap={{ scale: 0.98 }}` for tactile feedback.
- **Typography**: `Geist Sans` with tight tracking.

## Data Model (Schema)
The schema must support the hierarchy explicitly via a `tier` enum.
- **Resource**: Represent a study goal.
    - `tier`: `MACRO` | `MESO` | `MICRO`
    - `status`: `ACTIVE` | `COMPLETED`
- **Constraint Logic**:
    - `CREATE Resource` where `tier=MACRO` must check if `count(active_macro) == 0`.

## UI/UX: The Rigid Grid
Using Magic UI's BentoGrid to enforce the layout.
- **Macro**: `col-span-3 row-span-2`
- **Meso**: `col-span-1 row-span-1`
- **Micro**: `col-span-3 row-span-1` (Footer/Heatmap)

## Tech Stack Decisions
- **Next.js 16 + Server Actions**: For immediate mutation and optimistic UI updates (`useOptimistic`).
- **Tremor**: For "batteries-included" beautiful charts in the Micro slots.
- **Supabase + Prisma**: For reliable relational data and type safety.
