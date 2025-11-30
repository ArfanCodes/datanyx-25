# 🎮 Gamification System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTIONS                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Complete Task / Add Expense / Save     │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │      GamificationContext (Frontend)      │
        │  • updateStreakOnAction()                │
        │  • addMicroSaving()                      │
        │  • unlockAchievement()                   │
        └─────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │  AsyncStorage    │        │  Backend API     │
    │  (Local Cache)   │        │  (Sync/Backup)   │
    └──────────────────┘        └──────────────────┘
                │                           │
                ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │  Update State    │        │  Supabase DB     │
    └──────────────────┘        └──────────────────┘
                │
                ▼
    ┌─────────────────────────────────────────┐
    │         TRIGGER EFFECTS                  │
    ├─────────────────────────────────────────┤
    │  • Update Streak Badge                   │
    │  • Show Achievement Modal                │
    │  • Update Mascot Mood                    │
    │  • Show Success Notification             │
    │  • Update Progress Bars                  │
    └─────────────────────────────────────────┘
```

## Component Hierarchy

```
App.tsx
└── GamificationProvider
    └── AppNavigator
        └── MainNavigator
            ├── BottomTabs
            │   └── HomeScreen
            │       ├── StreakBadge
            │       ├── MicroWinCard
            │       ├── Mascot
            │       └── AchievementUnlockModal
            ├── AchievementsScreen
            └── RewardsStoreScreen
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    GAMIFICATION PROFILE                      │
├─────────────────────────────────────────────────────────────┤
│  streakCount: number                                         │
│  bestStreak: number                                          │
│  lastActiveDate: DateTime                                    │
│  monthlyMicroSavingsTotal: number                            │
│  achievements: {                                             │
│    firstWin: boolean                                         │
│    stabilityStarter: boolean                                 │
│    leakHunter: boolean                                       │
│    consistencyHero: boolean                                  │
│    saverSpark: boolean                                       │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

## Achievement Unlock Flow

```
User Action
    │
    ▼
Check Condition
    │
    ├─── Already Unlocked? ──► Skip
    │
    ├─── Condition Met? ──► Unlock Achievement
    │                          │
    │                          ▼
    │                     Update Profile
    │                          │
    │                          ▼
    │                     Show Modal
    │                          │
    │                          ▼
    │                     Send Notification
    │
    └─── Not Met ──► Continue
```

## Streak Calculation Logic

```
Current Date
    │
    ▼
Check lastActiveDate
    │
    ├─── NULL (First Time)
    │       │
    │       └──► Set streak = 1
    │
    ├─── Same Day
    │       │
    │       └──► No change (already counted)
    │
    ├─── Yesterday
    │       │
    │       └──► Increment streak
    │
    └─── Older
            │
            └──► Reset streak = 1 (broken)
```

## Micro-Saving Flow

```
User Adds Expense (₹147)
    │
    ▼
Calculate Round-Up
    │
    └──► Next ₹100 = ₹200
         Saving = ₹200 - ₹147 = ₹53
    │
    ▼
Is Saving >= ₹5?
    │
    ├─── YES ──► Show MicroWinCard
    │               │
    │               ▼
    │          User Taps "Save ₹53"
    │               │
    │               ▼
    │          addMicroSaving(53)
    │               │
    │               ├──► Update monthlyTotal
    │               ├──► Update streak
    │               ├──► Check achievements
    │               └──► Show success modal
    │
    └─── NO ──► Skip (too small)
```

## Mascot Mood Decision Tree

```
Get Mascot State
    │
    ├─── Recent Achievement? ──► EXCITED 🤩
    │
    ├─── Streak >= 3 days? ──► HAPPY 😊
    │
    ├─── Missed > 1 day? ──► SAD 😢
    │
    ├─── Overspending? ──► WORRIED 😰
    │
    ├─── Emergency Mode? ──► PROTECTIVE 🛡️
    │
    └─── Default ──► HAPPY 😊
```

## API Endpoints

```
/api/gamification
    │
    ├── GET /profile
    │   └── Returns: Full gamification profile
    │
    ├── POST /streak
    │   └── Updates: Streak count & last active date
    │
    ├── POST /achievement
    │   └── Body: { achievementKey: string }
    │   └── Updates: Achievements JSON
    │
    ├── POST /micro-saving
    │   └── Body: { amount: number }
    │   └── Updates: Monthly micro-savings total
    │
    └── POST /reset-monthly
        └── Resets: Monthly micro-savings to 0
```

## State Management

```
┌─────────────────────────────────────────┐
│      GamificationContext State          │
├─────────────────────────────────────────┤
│  profile: GamificationProfile           │
│  microSavingsCount: number              │
├─────────────────────────────────────────┤
│  Methods:                                │
│  • updateStreakOnAction()                │
│  • unlockAchievement(key)                │
│  • addMicroSaving(amount)                │
│  • getMascotState()                      │
│  • refreshProfile()                      │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│         AsyncStorage Keys                │
├─────────────────────────────────────────┤
│  @peso_gamification_profile              │
│  @peso_micro_savings_count               │
│  @peso_micro_savings_total               │
└─────────────────────────────────────────┘
```

## Screen Navigation

```
HomeScreen
    │
    ├── Trophy Icon ──► AchievementsScreen
    │                       │
    │                       └── Back Button ──► HomeScreen
    │
    └── Gift Icon ──► RewardsStoreScreen
                          │
                          └── Back Button ──► HomeScreen
```

## Achievement Conditions Matrix

```
┌──────────────────────┬─────────────────────┬──────────────┐
│   Achievement        │   Condition         │   Trigger    │
├──────────────────────┼─────────────────────┼──────────────┤
│ First Win 🏆         │ tasksCompleted >= 1 │ Task done    │
│ Stability Starter 💰 │ savings >= ₹50      │ Micro-save   │
│ Leak Hunter 🔍       │ viewedLeaks = true  │ View leaks   │
│ Consistency Hero 🔥  │ streak >= 3         │ Streak +1    │
│ Saver Spark ⚡       │ saveCount >= 3      │ Micro-save   │
└──────────────────────┴─────────────────────┴──────────────┘
```

## Notification Schedule

```
Time-Based Notifications:
    │
    ├── 9:00 AM ──► Daily Motivation
    │
    ├── 8:00 PM ──► Streak Reminder (if no activity)
    │
    └── Sunday 6:00 PM ──► Weekly Summary

Event-Based Notifications:
    │
    ├── Achievement Unlocked ──► Immediate
    │
    ├── Milestone Reached ──► Immediate
    │
    ├── Micro-Saving Added ──► Immediate
    │
    └── 24h Inactivity ──► After 24 hours
```

## Performance Optimization

```
Component Rendering:
    │
    ├── StreakBadge ──► Memoized, updates on streak change
    │
    ├── MicroWinCard ──► Conditional render, unmounts when hidden
    │
    ├── Mascot ──► Memoized, updates on mood change
    │
    └── AchievementModal ──► Lazy loaded, portal-based

Data Fetching:
    │
    ├── AsyncStorage ──► Cached, loaded on mount
    │
    ├── API Calls ──► Debounced, batched when possible
    │
    └── State Updates ──► Optimistic UI, background sync
```

## Error Handling

```
Try-Catch Blocks:
    │
    ├── AsyncStorage Operations
    │   └── Fallback: Use default values
    │
    ├── API Calls
    │   └── Fallback: Use cached data
    │
    └── Achievement Unlocks
        └── Fallback: Log error, continue
```

---

## Quick Reference

### Key Files
- **Context**: `src/contexts/GamificationContext.tsx`
- **Types**: `src/types/gamification.ts`
- **Components**: `src/components/Streak*.tsx`, `Micro*.tsx`, `Mascot.tsx`
- **Screens**: `src/screens/Achievements/`, `src/screens/Rewards/`
- **Backend**: `backend/src/controllers/gamification.controller.ts`

### Key Functions
- `updateStreakOnAction()` - Call on any positive user action
- `addMicroSaving(amount)` - Call when user saves micro-amount
- `unlockAchievement(key)` - Call when condition is met
- `getMascotState()` - Get current mascot mood

### Key States
- `profile.streakCount` - Current consecutive days
- `profile.achievements` - Object with 5 boolean flags
- `profile.monthlyMicroSavingsTotal` - Total saved this month
- `microSavingsCount` - Number of micro-saves this month

---

**This architecture ensures:**
- ✅ Scalability
- ✅ Maintainability
- ✅ Performance
- ✅ User engagement
- ✅ Data consistency
