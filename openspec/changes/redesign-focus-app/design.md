# Design: redesign-focus-app

## Architecture Overview

### Application Structure
```
app/
├── layout.tsx              # Root layout with navigation
├── globals.css             # Design system tokens
├── (main)/                 # Main app routes (with nav)
│   ├── layout.tsx          # Navigation wrapper
│   ├── analytics/
│   │   └── page.tsx        # Analytics with tabs
│   ├── timer/
│   │   └── page.tsx        # Single-task timer
│   ├── focus-box/
│   │   └── page.tsx        # Bento 3-task sessions
│   └── profile/
│       └── page.tsx        # User profile
├── actions/
│   ├── session-actions.ts  # Create/complete sessions
│   ├── award-actions.ts    # Check & unlock awards
│   └── user-actions.ts     # Profile updates
lib/
├── prisma.ts               # Prisma client
├── utils.ts                # Utilities
├── focus-score.ts          # Focus score calculation
├── sounds.ts               # Ambient sound definitions
└── data.ts                 # Data fetching functions
components/
├── ui/                     # Base UI components
├── navigation/             # Nav bar components
├── timer/                  # Timer components
├── focus-box/              # Bento box components
├── analytics/              # Analytics components
└── profile/                # Profile components
```

## Database Schema Design

### Entity Relationship
```
User 1──* Session
User 1──* UserAward
User 1──1 UserStats
Session *──1 SessionType (enum)
UserAward *──1 AwardType (enum)
```

### Models

#### User
- `id`, `email`, `name`, `username`, `image`, `createdAt`, `updatedAt`
- Relations: `sessions[]`, `awards[]`, `stats`

#### Session
Core entity for tracking all focus sessions (Timer, Bento, Routine).
- `id`, `userId`, `type` (TIMER | BENTO | ROUTINE)
- `taskName`, `durationPlanned` (seconds), `durationActual` (seconds)
- `pauseCount`, `focusScore` (0-100)
- `completedAt`, `createdAt`
- For Bento: `bentoTaskIndex` (0, 1, 2), `bentoSessionId` (groups 3 tasks)

#### UserAward
Tracks which awards a user has unlocked.
- `id`, `userId`, `awardType` (enum), `unlockedAt`

#### UserStats
Aggregated stats for performance (updated after each session).
- `id`, `userId`
- `currentStreak`, `longestStreak`, `lastActiveDate`
- `totalSessions`, `totalFocusMinutes`
- `perfectScoreCount`, `noPassSessionCount`

### AwardType Enum (16 Awards)
```prisma
enum AwardType {
  // Focus Mastery
  TASK_STARTER          // 5 sessions
  PERFECT_FOCUS         // 25 perfect focus scores
  FOCUS_CHAMPION        // 50 sessions over 90%
  STEADY_PERFORMER      // 20 sessions 25-45 min
  
  // ADHD Superpowers
  TIMER_SPECIALIST      // 50 timer sessions
  COMEBACK_CHAMPION     // 5 sessions with 4+ pauses
  ZEN_MASTER            // 20 perfect + no pauses
  NO_PAUSE_PRO          // 30 sessions no pauses
  
  // Consistency Builder
  BENTO_MASTER          // 25 bento sessions
  ROUTINE_CHAMPION      // 25 routine sessions
  ROUTINE_BUILDER       // 30 consecutive days
  PERSISTENCE_MASTER    // 30 sessions with 1-3 pauses
}
```

## Focus Score Algorithm

### Base Calculation
```typescript
function calculateFocusScore(
  durationPlanned: number,  // in seconds
  durationActual: number,
  pauseCount: number,
  wasInterrupted: boolean   // stopped before completion
): number {
  let score = 100;
  
  // Escalating pause penalty: -10, -15, -20, -25...
  for (let i = 0; i < pauseCount; i++) {
    score -= 10 + (i * 5);
  }
  
  // Early stop penalty
  if (wasInterrupted) {
    const completionRatio = durationActual / durationPlanned;
    if (completionRatio < 0.5) {
      score -= 20;
    } else if (completionRatio < 0.75) {
      score -= 10;
    }
  }
  
  return Math.max(0, Math.min(100, score));
}
```

### Example Scenarios
| Pauses | Completion | Score |
|--------|------------|-------|
| 0 | 100% | 100% |
| 1 | 100% | 90% |
| 2 | 100% | 75% (90-15) |
| 3 | 100% | 55% (75-20) |
| 0 | 40% (stopped) | 80% |
| 2 | 40% (stopped) | 55% |

## Navigation Design

### Bottom Navigation Bar
Sticky bottom nav with 4 main buttons:
1. **Analytics** (📊) - Charts icon
2. **Timer** (⏱️) - Timer icon
3. **Focus Box** (📦) - Grid/box icon
4. **Profile** (👤) - User icon

### Visual Style
- Soft rounded pill-shaped nav bar (`rounded-full`)
- Frosted glass effect (`backdrop-blur-lg`)
- Active indicator: sage green highlight
- Icons: Lucide React icons

## Analytics Subsections

### Tab Navigation
Within Analytics page, horizontal tab bar:
- **Overview** | **Insights** | **Awards** | **History**

### Overview Section
1. **Greeting Card** - "Good morning, {name}!" with date
2. **Focus Score Badge** - Large circular % display with color coding
3. **Streak Counter** - 🔥 Day streak with flame animation
4. **Session Type Pie Chart** - Timer vs Bento vs Routine distribution
   - Dropdown: Last 25 / 50 / 100 sessions

### Insights Section
1. **Your Focus Score** - Large % with trend arrow
2. **Focus Score Over Time** - Line chart (last 30 days)
3. **Smart Insights** - AI-generated 3 key observations
4. **Personal Insights Grid**:
   - Peak Performance: Best time window + avg score
   - Focus Sweet Spot: Optimal duration + avg score
   - Average Session: Typical length
   - Monthly Total: Last 30 days focus time

### Awards Section
1. **Your Next Award** - Nearest to completion with progress bar
2. **Award Categories** (collapsible):
   - Focus Mastery (4 awards)
   - ADHD Superpowers (4 awards)
   - Consistency Builder (4 awards)
3. Award display: Icon + name + description + progress/unlocked badge

### History Section
- Dropdown: Last 25 / 50 / 100 sessions
- List view: Session cards with:
  - Session type badge (Timer/Bento/Routine)
  - Task name
  - Duration
  - Focus Score %
  - Timestamp

## Timer Page Design

### Main Timer Display
- Large circular timer with progress ring
- Sage green progress fill
- Time remaining in MM:SS format
- Task name above timer

### Controls
1. **Duration Selector** - Presets: 15, 25, 45, 60 min + custom
2. **Task Name Input** - Editable text field
3. **Sound Selector** - Dropdown with preview:
   - Off, Rain, Forest, Ocean, Lo-fi, White Noise, Fireplace
4. **Start/Pause Button** - Large primary CTA
5. **Reset Button** - Secondary action

### Timer States
- **Idle** - Shows duration selector, ready to start
- **Running** - Timer counting down, pause visible
- **Paused** - Resume button, pause count displayed
- **Completed** - Celebration animation, score display

## Focus Box Page Design

### Bento Task Queue
3-slot grid representing the bento box:
```
┌─────────────┬─────────────┐
│   Task 1    │   Task 2    │
│   25 min    │   15 min    │
├─────────────┴─────────────┤
│          Task 3           │
│          30 min           │
└───────────────────────────┘
```

### Task Configuration
Each slot has:
- Task name (editable)
- Duration selector (5-60 min)
- Drag handle for reordering

### Session Flow
1. Configure 3 tasks
2. Click "Start Focus"
3. Timer 1 runs → Completion → Intermission screen
4. User clicks "Continue" → Timer 2 runs → ...
5. After 3rd timer → Session complete → Score display

### Intermission Screen
- "Great work! Ready for next task?"
- Next task preview
- "Continue" button
- Option to end session early

## Profile Page Design

### Sections
1. **User Info Card**
   - Avatar (placeholder or initials)
   - Name, username
   - Edit button

2. **Quick Stats**
   - Total sessions
   - Total focus hours
   - Current streak
   - Member since

3. **Settings** (basic)
   - Default timer duration
   - Default sound preference
   - Theme toggle (future)

## Ambient Sounds

### Default Sound Library
```typescript
const AMBIENT_SOUNDS = [
  { id: 'off', name: 'Off', file: null },
  { id: 'rain', name: 'Rain', file: '/sounds/rain.mp3' },
  { id: 'forest', name: 'Forest', file: '/sounds/forest.mp3' },
  { id: 'ocean', name: 'Ocean Waves', file: '/sounds/ocean.mp3' },
  { id: 'lofi', name: 'Lo-fi Beats', file: '/sounds/lofi.mp3' },
  { id: 'whitenoise', name: 'White Noise', file: '/sounds/whitenoise.mp3' },
  { id: 'fireplace', name: 'Fireplace', file: '/sounds/fireplace.mp3' },
];
```

## Design System

### Color Tokens
```css
:root {
  --color-sage: #C5C9A4;
  --color-sage-muted: #B5C4A8;
  --color-brown: #7A6052;
  --color-peach: #D4A27C;
  --color-charcoal: #3A3A3A;
  --color-cream: #F8F8F8;
  
  /* Semantic tokens */
  --color-background: var(--color-cream);
  --color-surface: #FFFFFF;
  --color-primary: var(--color-sage);
  --color-accent: var(--color-peach);
  --color-text: var(--color-charcoal);
  --color-text-muted: #6B6B6B;
}
```

### Typography
- Font: Inter (Google Fonts)
- Headings: 600 weight
- Body: 400 weight
- Sizes: 12, 14, 16, 20, 24, 32, 48px scale

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 20px
- Full: 9999px (pills)

### Shadows
- Subtle: `0 2px 8px rgba(58, 58, 58, 0.08)`
- Medium: `0 4px 16px rgba(58, 58, 58, 0.12)`
- Large: `0 8px 32px rgba(58, 58, 58, 0.16)`

### Animation
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Duration: 150ms (micro), 300ms (standard), 500ms (emphasis)
- Use Framer Motion for complex animations

## Technical Decisions

### State Management
- React Context for timer state (running, paused, etc.)
- Server actions for all database mutations
- Optimistic updates for UI responsiveness

### Audio Playback
- HTML5 Audio API with Web Audio API fallback
- Loop ambient sounds
- Volume control in profile settings
- Persist preference in localStorage

### Charts
- Use Recharts or Tremor for analytics
- Responsive sizing
- Consistent color usage from palette

### Accessibility
- Focus indicators on all interactive elements
- ARIA labels for timer states
- Keyboard navigation for timer controls
- Reduced motion preference respected
