# Project Context

## Purpose
**Bento Focus** is a soft, minimalistic focus timer web application designed for deep work sessions, particularly tailored for users with ADHD. The app helps users track their focus sessions, build habits through a unique "Bento" system (3-task grouped sessions), earn achievements, and view analytics on their productivity patterns.

### Core Features
- **Timer**: Single-task focus sessions with configurable durations
- **Focus Box (Bento)**: 3-task grouped focus sessions
- **Analytics**: Overview, insights, awards, and session history
- **Profile**: User settings and preferences
- **Focus Score**: Calculated based on pauses, completion rate, and session quality

## Tech Stack

### Core Framework
- **Next.js** (latest) - React framework with App Router
- **TypeScript** - Strict mode enabled
- **React** (latest) - UI library

### Styling
- **Tailwind CSS 3.3** - Utility-first CSS
- **Custom Design System** - Bento color palette (sage, brown, peach, charcoal, cream)
- **CSS Modules** - For page-specific styles
- **Framer Motion 11** - Animations and transitions

### Database
- **PostgreSQL** - Primary database
- **Prisma 5.10** - ORM and database client
- **Supabase** - Hosted PostgreSQL (via `DATABASE_URL` and `DIRECT_URL`)

### UI Components
- **Tremor React** - Chart components and data visualization
- **Lucide React** - Icon library
- **HeadlessUI** - Accessible UI primitives
- **Geist Font** - Typography

### Utilities
- **clsx** - Conditional class names
- **tailwind-merge** - Merge Tailwind classes

## Project Conventions

### Code Style
- **TypeScript strict mode** - All code must pass strict type checking
- **Functional components** - React components are written as functions
- **Named exports** - Prefer named exports over default exports for components
- **Path aliases** - Use `@/*` for imports (e.g., `@/lib/utils`)
- **File naming** - Lowercase with dashes (e.g., `focus-score.ts`, `use-timer.ts`)
- **Component naming** - PascalCase (e.g., `TapScale`, `BottomNav`)

### Architecture Patterns
- **App Router** - Using Next.js 13+ App Router with route groups `(main)`
- **Server/Client separation** - Clear separation with `"use client"` directives
- **Colocation** - Page-specific CSS modules alongside page components
- **Shared utilities** - Common logic in `lib/` directory
- **Component organization**:
  - `components/motion/` - Motion/animation components
  - `components/navigation/` - Navigation components
- **Server Actions** - Located in `app/actions/` for database mutations

### Database Patterns
- **Session model** - Tracks individual focus sessions with type (TIMER, BENTO, ROUTINE)
- **Focus Score** - 0-100 score calculated from pauses and completion
- **UserStats** - Aggregated statistics for performance (streaks, totals)
- **Awards system** - Achievement types defined as enums in schema

### Testing Strategy
- Manual testing via development server (`npm run dev`)
- Build verification (`npm run build`)
- Lint checks (`npm run lint`)

### Git Workflow
- Feature branches for new development
- OpenSpec proposals for significant changes
- Conventional commits recommended

## Domain Context

### Focus Timer Concepts
- **Focus Score**: 0-100 metric based on:
  - Pause count (fewer pauses = higher score)
  - Completion percentage (actual vs planned duration)
  - Session type multipliers
  
- **Session Types**:
  - `TIMER`: Single standalone focus session
  - `BENTO`: Part of a 3-task Focus Box session (grouped by `bentoSessionId`)
  - `ROUTINE`: Scheduled recurring sessions (future feature)

- **Bento Session**: A group of 3 consecutive tasks, tracked together with `bentoSessionId` and `bentoTaskIndex` (0, 1, 2)

### Awards Categories
1. **Focus Mastery** - Achievement for session quality
2. **ADHD Superpowers** - Celebrating neurodiverse strengths
3. **Consistency Builder** - Rewards for regular practice

## Important Constraints

### Technical
- Mobile-first responsive design
- Viewport-fit for notched devices (`viewport-fit=cover`)
- PostgreSQL required (Prisma configured for it)
- Environment variables required: `DATABASE_URL`, `DIRECT_URL`

### Design
- Soft, minimalistic aesthetic
- Bento color palette must be maintained
- Inter font family as primary typeface
- Accessibility considerations for focus/timer states

### Performance
- Aggregated stats in `UserStats` to avoid expensive session queries
- Indexed queries on `userId + completedAt` and `bentoSessionId`

## External Dependencies

### Services
- **Supabase** - PostgreSQL hosting with connection pooling (`DATABASE_URL` for pooled, `DIRECT_URL` for direct connections)

### Key Libraries
| Package | Version | Purpose |
|---------|---------|---------|
| next | latest | React framework |
| prisma | 5.10.2 | Database ORM |
| @tremor/react | 3.14.0 | Charts & data viz |
| framer-motion | 11.0.8 | Animations |
| lucide-react | 0.344.0 | Icons |
| tailwindcss | 3.3.0 | Styling |
