# Implementation Tasks

## Phase 1: Foundation
- [x] **Schema Definition**: Update `schema.prisma` with `Resource` and `StudyLog` models.
- [x] **Migration**: Run `npx prisma migrate dev` to create the tables.
- [x] **Seed Data**: Create `prisma/seed.ts` to populate 1 Macro, 2 Mesos, and 30 days of logs for immediate visual feedback.

## Phase 2: Core Logic
- [x] **Server Actions**: Create `app/actions/focus-actions.ts`.
    - [x] Implement `createResource` with "Single Macro" constraint check.
    - [x] Implement `updateProgress` for incrementing counters.
- [x] **Data Fetching**: Create data access layer (DAL) or fetch functions to get the "Bento" state (Active Macro, Active Mesos).

## Phase 3: Dashboard UI
- [x] **Layout Shell**: Create `/dashboard/page.tsx` with the Magic UI rigid grid structure.
- [x] **Macro Component**: Build the Large Box (Slot A) with cover image and progress.
- [x] **Meso Component**: Build the Medium Box (Slot B & C) with Tremor Ring Progress.
- [x] **Micro Component**: Build the Footer (Slot D) with Tremor Tracker/Heatmap.

## Phase 4: Polish
- [x] **Animations**: Integrate `framer-motion` for tap/spring effects on Bento boxes.
- [x] **Styling**: Verify `neutral-950` theme and typography (Geist Sans).
