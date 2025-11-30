# 🎮 Gamification Quick Start Guide

## Testing the Gamification Features

### 1. **Test Streak System**

**Action**: Complete a fixed expense checkbox on Home Screen

**Expected Result**:
- Streak count increases by 1
- If first action: "First Win" achievement unlocks
- If 3rd consecutive day: "Consistency Hero" achievement unlocks
- Mascot shows happy mood

**How to Test**:
1. Open Home Screen
2. Tap any fixed expense checkbox
3. Check Streak Badge - should show "1 Days"
4. Tap Streak Badge to see details

---

### 2. **Test Micro-Savings**

**Action**: Add an expense that triggers round-up savings

**Expected Result**:
- Micro-Win Card appears
- Tapping "Save ₹X" adds to monthly total
- Success modal appears
- Micro-savings indicator shows updated total

**How to Test**:
1. Tap "+ Add Expense" button
2. Enter amount like "₹147" (will suggest ₹53 saving)
3. Tap "Add Expense"
4. Micro-Win Card appears
5. Tap "Save ₹53"
6. Check micro-savings indicator

---

### 3. **Test Achievements Screen**

**Action**: Navigate to Achievements

**Expected Result**:
- Shows 5 achievement badges
- Unlocked badges are colored with checkmark
- Locked badges are grey with lock icon
- Progress bar shows X/5 unlocked

**How to Test**:
1. Tap Trophy icon in Home Screen header
2. View all achievements
3. Check progress tracker
4. Tap back to return

---

### 4. **Test Rewards Store**

**Action**: Navigate to Rewards Store

**Expected Result**:
- Shows 6 reward cards
- All marked "Coming Soon"
- Shows current streak count
- Displays unlock requirements

**How to Test**:
1. Tap Gift icon in Home Screen header
2. View all rewards
3. Check streak requirement badges
4. Tap back to return

---

### 5. **Test Mascot Moods**

**Mascot States**:
- **Happy** 😊 - Active streak
- **Excited** 🤩 - Achievement unlocked
- **Sad** 😢 - Missed streak (test by changing lastActiveDate)

**How to Test**:
1. Complete actions to maintain streak → Happy mascot
2. Unlock achievement → Excited mascot
3. Skip a day → Sad mascot

---

### 6. **Test Achievement Unlock Modal**

**Action**: Trigger an achievement unlock

**Expected Result**:
- Celebratory modal appears with sparkles
- Shows achievement icon, title, description
- "Awesome! 🎉" button to dismiss

**How to Test**:
1. Complete first task → "First Win" modal
2. Save ₹50 total → "Stability Starter" modal
3. Get 3-day streak → "Consistency Hero" modal

---

## Achievement Unlock Conditions

| Achievement | Condition | How to Test |
|------------|-----------|-------------|
| **First Win** 🏆 | Complete 1 task | Check any fixed expense |
| **Stability Starter** 💰 | Save ₹50 total | Add multiple micro-savings totaling ₹50+ |
| **Leak Hunter** 🔍 | View leaks screen | Navigate to Leaks tab |
| **Consistency Hero** 🔥 | 3-day streak | Complete tasks 3 days in a row |
| **Saver Spark** ⚡ | 3 micro-savings | Save 3 different micro-savings |

---

## Debugging Tips

### Check AsyncStorage Data:
```javascript
// In React Native Debugger Console
AsyncStorage.getItem('@peso_gamification_profile').then(console.log);
AsyncStorage.getItem('@peso_micro_savings_count').then(console.log);
```

### Reset Gamification Data:
```javascript
// Clear all gamification data
AsyncStorage.removeItem('@peso_gamification_profile');
AsyncStorage.removeItem('@peso_micro_savings_count');
AsyncStorage.removeItem('@peso_micro_savings_total');
```

### Check Current State:
```tsx
const { profile } = useGamification();
console.log('Streak:', profile.streakCount);
console.log('Achievements:', profile.achievements);
console.log('Micro-savings:', profile.monthlyMicroSavingsTotal);
```

---

## Demo Script for Hackathon

### **Scene 1: First Time User** (30 seconds)
1. Open app → Show Home Screen
2. Point out Streak Badge (0 days)
3. Complete first expense → Streak updates to 1
4. "First Win" achievement unlocks → Modal appears
5. Tap Trophy icon → Show achievements screen

### **Scene 2: Micro-Savings Magic** (45 seconds)
1. Tap "+ Add Expense"
2. Enter ₹147
3. Micro-Win Card appears: "Save ₹53"
4. Tap "Save ₹53"
5. Success modal: "🎉 You saved ₹53!"
6. Show micro-savings indicator updated
7. Mascot shows excited mood

### **Scene 3: Streak Power** (30 seconds)
1. Show Streak Badge (3 days)
2. Tap to open streak modal
3. Show current vs best streak
4. Explain streak maintenance tips
5. "Consistency Hero" achievement unlocked

### **Scene 4: Rewards Teaser** (20 seconds)
1. Tap Gift icon
2. Show Rewards Store
3. Point out "7-day streak reward"
4. Explain "Coming Soon" features
5. Build excitement for future updates

**Total Demo Time: ~2 minutes**

---

## Common Issues & Solutions

### Issue: Streak not updating
**Solution**: Check if `lastActiveDate` is today. Streak only updates once per day.

### Issue: Achievements not unlocking
**Solution**: Verify conditions are met. Check `profile.achievements` object.

### Issue: Micro-Win Card not appearing
**Solution**: Ensure expense amount creates round-up ≥ ₹5.

### Issue: Components not rendering
**Solution**: Verify `GamificationProvider` wraps the app in `App.tsx`.

---

## API Testing (Backend)

### Test with cURL or Postman:

```bash
# Get gamification profile
GET http://localhost:3000/api/gamification/profile
Headers: Authorization: Bearer <token>

# Update streak
POST http://localhost:3000/api/gamification/streak
Headers: Authorization: Bearer <token>

# Unlock achievement
POST http://localhost:3000/api/gamification/achievement
Headers: Authorization: Bearer <token>
Body: { "achievementKey": "firstWin" }

# Add micro-saving
POST http://localhost:3000/api/gamification/micro-saving
Headers: Authorization: Bearer <token>
Body: { "amount": 25 }
```

---

## Performance Checklist

- ✅ All components use React.memo where appropriate
- ✅ AsyncStorage operations are async
- ✅ No unnecessary re-renders
- ✅ Smooth animations (60fps)
- ✅ Fast navigation transitions
- ✅ Optimized images/icons

---

**🚀 You're ready to demo! Good luck at the hackathon!**
