# Change: Add Supabase Auth with Progress Saving and Live Analytics

## Why
The app currently uses mock data for analytics and has no authentication. Users cannot:
1. Sign in and persist their focus sessions across devices
2. See real analytics based on their actual session history
3. Have their awards, streaks, and progress saved

## What Changes
- **Supabase Auth** integration for user sign-in (email/password)
- **Session persistence** - completed focus sessions save to Supabase/Prisma for logged-in users
- **Guest mode** - Timer and Focus Box work without login (sessions stored locally)
- **Real analytics data** - Analytics page pulls from actual user sessions
- **User context** - App-wide auth state via React Context
- **Protected routes** - Analytics and Profile require authentication

## Impact
- Affected specs: New `auth` capability, modified analytics-data integration
- Affected code:
  - `lib/supabase.ts` (new) - Supabase client setup
  - `lib/auth-context.tsx` (new) - Auth provider and hooks
  - `app/(main)/layout.tsx` - Wrap with auth provider
  - `app/(main)/analytics/page.tsx` - Replace mock data with real queries
  - `app/(main)/timer/page.tsx` - Save sessions on complete
  - `app/(main)/focus-box/page.tsx` - Save bento sessions on complete
  - `app/auth/` (new) - Login/signup pages
  - `middleware.ts` (new) - Route protection
