# Implement Bento Learn Core

## Summary
Establish the core infrastructure and UI for "Bento Learn," a developer-focused study tracker based on the "Bento Focus" philosophy. This includes the database schema for constrained goal tracking, the rigid "Bento" dashboard layout, and server actions to enforce focus constraints.

## Rationale
The user requires a specific "Constraint-based Productivity" system where users are limited to:
- 1 Large "Macro" focus.
- 2 Medium "Meso" habits.
- Small "Micro" stats.

This structure is critical to the product's value proposition of preventing overwhelm. The aesthetic must mimic high-quality iOS design patterns on the web.

## Impact
- **Database**: Adds `Resource` and `StudyLog` models; updates `User`.
- **UI**: Creates `/dashboard/page.tsx` using Magic UI and Tremor.
- **Logic**: Implement server actions with strict constraint checking (single active Macro).
