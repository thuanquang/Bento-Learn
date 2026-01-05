# Tasks: Add Supabase Auth + Analytics

## 1. Supabase Setup ✅
- [x] 1.1 Install `@supabase/supabase-js` and `@supabase/ssr`
- [x] 1.2 Create `lib/supabase/client.ts` (browser client)
- [x] 1.3 Create `lib/supabase/server.ts` (server client)
- [x] 1.4 Add SUPABASE_URL and SUPABASE_ANON_KEY to `.env.example`

## 2. Auth Context & Hooks ✅
- [x] 2.1 Create `lib/auth-context.tsx` with AuthProvider
- [x] 2.2 Implement `useAuth()` hook (user, loading, signIn, signOut)
- [x] 2.3 Add user sync to Prisma on auth state change
- [x] 2.4 Wrap `app/(main)/layout.tsx` with AuthProvider

## 3. Auth Pages ✅
- [x] 3.1 Create `app/auth/login/page.tsx` with email/password form
- [x] 3.2 Create `app/auth/signup/page.tsx` with registration form
- [x] 3.3 Create `app/auth/callback/route.ts` for auth callback
- [x] 3.4 Style auth pages to match Bento design system

## 4. Route Protection ✅
- [x] 4.1 Create `middleware.ts` to protect `/analytics` and `/profile`
- [x] 4.2 Redirect unauthenticated users from protected routes to `/auth/login`
- [x] 4.3 Redirect authenticated users from `/auth/*` to `/timer`
- [x] 4.4 Allow `/timer` and `/focus-box` for all users (guest mode)

## 5. Session Saving Integration ✅
- [x] 5.1 Update Timer page: if logged in, call `createSession()`; else save to localStorage
- [x] 5.2 Update Focus Box page: if logged in, call `createBentoSession()`; else save to localStorage
- [x] 5.3 Create `lib/local-sessions.ts` for localStorage session management
- [x] 5.4 Add "Sign in to save your progress" prompt for guest users
- [x] 5.5 Add sync-on-login: upload local sessions to database when user signs in

## 6. Analytics with Real Data ✅
- [x] 6.1 Create `app/(main)/analytics/data.ts` with data fetching functions
- [x] 6.2 Update OverviewTab to use `getSessionDistribution()`, `getUserStats()`
- [x] 6.3 Update InsightsTab to use `getFocusScoreTrend()`, `getPeakPerformance()`, `getFocusSweetSpot()`
- [x] 6.4 Update AwardsTab to use `getUserAwards()`
- [x] 6.5 Update HistoryTab to use `getRecentSessions()` with pagination
- [x] 6.6 Add loading states and empty states for each tab

## 7. Profile Integration ✅
- [x] 7.1 Update Profile page to display real user data
- [x] 7.2 Add logout button that calls `signOut()`
- [x] 7.3 Show user stats from database

## 8. Testing & Polish ✅
- [x] 8.1 Build verification: `npm run build` passes
- [ ] 8.2 Manual test: sign up → complete session → view analytics
- [ ] 8.3 Manual test: sign out → protected route redirects
- [ ] 8.4 Manual test: offline session save → retry on reconnect
