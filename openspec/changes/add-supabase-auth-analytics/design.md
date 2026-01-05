# Design: Supabase Auth + Analytics Integration

## Context
Bento Focus needs user authentication to persist focus sessions and display real analytics. The app already has:
- Prisma schema with User, Session, UserStats, UserAward models
- Server actions for creating sessions and updating stats
- Data fetching functions in `lib/data.ts`
- Analytics page with mock data

We need to connect these pieces with Supabase Auth.

## Goals
- Enable email/password sign-in
- Persist sessions to database with user association
- Replace mock analytics data with real queries
- Maintain offline-friendly UX (timer works without network)
- **Allow guest usage** of Timer and Focus Box without login

## Non-Goals
- Multi-device sync in real-time (eventual consistency is fine)
- Admin dashboard

## Decisions

### 1. Supabase Auth with Prisma
**Decision**: Use Supabase Auth for authentication, sync users to Prisma User table.

**Rationale**: Supabase provides:
- Managed auth infrastructure
- JWT tokens for API authentication
- Row-level security if needed later

**User sync flow**:
1. User signs in via Supabase
2. `onAuthStateChange` triggers
3. Upsert user to Prisma User table
4. Store Supabase user ID as Prisma user ID

### 2. Client-Side Auth Context
**Decision**: Use React Context for auth state, not server components.

**Rationale**: 
- Timer and Focus Box are client components
- Need immediate access to userId for session saving
- Reduces complexity vs RSC auth

### 3. Session Saving Strategy
**Decision**: Different behavior for authenticated vs guest users.

**Authenticated flow**:
1. Timer/Bento completes → calculate focus score
2. Call server action `createSession()`
3. If offline/fails, store in localStorage
4. Retry on next app load

**Guest flow**:
1. Timer/Bento completes → calculate focus score
2. Store session in localStorage only
3. Prompt user to sign in to save progress permanently
4. On sign-in, optionally sync local sessions to database

### 4. Analytics Data Fetching
**Decision**: Use server components with data fetching in Analytics page.

**Rationale**:
- Analytics is read-heavy, benefits from server rendering
- Can use Prisma queries directly
- Tab content can be client components for interactivity

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Supabase outage blocks sign-in | Show friendly error, allow retry |
| Slow analytics queries | Use aggregated UserStats, paginate history |
| Token expiry mid-session | Supabase client auto-refreshes tokens |

## Migration Plan

1. **Phase 1**: Add Supabase client + auth context (no breaking changes)
2. **Phase 2**: Add login/signup pages at `/auth/login`, `/auth/signup`
3. **Phase 3**: Wire up session saving in Timer/Focus Box
4. **Phase 4**: Replace mock data in Analytics with real queries
5. **Phase 5**: Add route protection middleware

Rollback: Remove middleware to disable protection; mock data still works.

## Open Questions
- Should we support magic link auth? (Simpler UX but requires email setup)
- Guest mode with local-only storage?
