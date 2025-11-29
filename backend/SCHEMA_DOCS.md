# Prisma Schema Documentation - Peso Finance App

## Overview
This is a comprehensive, production-ready Prisma schema for the **Peso** finance intelligence application. It supports all core features including onboarding, transactions, EMI tracking, subscriptions, leak detection, stability scoring, budgets, and savings goals.

## Database Models

### 1. **User** (Authentication & Core)
- Email/password authentication
- Profile information (name, phone, avatar)
- Onboarding status tracking
- Last login timestamp
- Relations to all user-specific data

### 2. **Profile** (Onboarding & Settings)
- Monthly income and currency
- Financial goals (array of enums)
- Risk tolerance (LOW, MEDIUM, HIGH)
- Personal info (age, occupation, city, dependents)
- Coach mode settings
- Emergency fund tracking
- User preferences (notifications, dark mode)

### 3. **Transaction** (Core Financial Data)
- **Types**: INCOME, EXPENSE, EMI, SUBSCRIPTION
- **Expense Types**: FIXED (rent, EMI) or VARIABLE (food, shopping)
- Category-based organization
- Recurring transaction support
- Tags for flexible categorization
- Receipt attachment support
- Full metadata (date, notes, description)

### 4. **EMI** (Loan Management)
- Principal amount and interest rate
- Tenure and monthly EMI calculation
- Payment tracking (paid vs remaining)
- Start and end dates
- Lender information
- Automatic remaining amount calculation

### 5. **Subscription** (Recurring Payments)
- Service name and amount
- Billing cycle (DAILY, WEEKLY, MONTHLY, QUARTERLY)
- Status (ACTIVE, PAUSED, CANCELLED)
- Next billing date tracking
- Auto-renewal settings
- Logo and website metadata

### 6. **Leak** (Money Leak Detection)
- Category and amount
- Frequency analysis
- **Severity Levels**: LOW, MEDIUM, HIGH, CRITICAL
- Monthly and yearly impact calculations
- AI-generated suggestions
- Resolution tracking

### 7. **StabilityLog** (Financial Health)
- **Stability Score**: 0-100 rating
- **Modes**: STABLE, MODERATE, UNSTABLE, EMERGENCY
- Component scores:
  - Income stability (variance analysis)
  - Expense patterns
  - Savings rate
  - Debt ratio
  - Emergency fund coverage
- AI-generated insights and recommendations
- Monthly tracking

### 8. **Budget** (Spending Limits)
- Category-wise budget limits
- Spent amount tracking
- Period-based (weekly, monthly, yearly)
- Alert thresholds
- Date range tracking

### 9. **SavingsGoal** (Financial Goals)
- Target and current amounts
- Deadline tracking
- Priority levels (1-5)
- Category (from FinancialGoal enum)
- Completion status
- Custom icons

### 10. **Notification** (User Alerts)
- Title and message
- Type categorization (leak_detected, bill_due, etc.)
- Read/unread status
- Action URLs
- Custom icons
- Timestamp tracking

## Enums

### TransactionType
- `INCOME` - Salary, freelance, etc.
- `EXPENSE` - Regular spending
- `EMI` - Loan payments
- `SUBSCRIPTION` - Recurring services

### ExpenseType
- `FIXED` - Rent, insurance, EMI
- `VARIABLE` - Food, entertainment, shopping

### RiskTolerance
- `LOW` - Conservative approach
- `MEDIUM` - Balanced approach
- `HIGH` - Aggressive approach

### LeakSeverity
- `LOW` - Minor leaks (<₹2000/month)
- `MEDIUM` - Moderate leaks (₹2000-5000/month)
- `HIGH` - Significant leaks (₹5000+/month)
- `CRITICAL` - Severe financial drain

### LeakFrequency
- `DAILY` - Daily recurring expenses
- `WEEKLY` - Weekly patterns
- `MONTHLY` - Monthly subscriptions
- `QUARTERLY` - Quarterly payments

### StabilityMode
- `STABLE` (Green) - Healthy finances
- `MODERATE` (Yellow) - Watch out
- `UNSTABLE` (Orange) - Take action
- `EMERGENCY` (Red) - Critical situation

### CoachMode
- `SAVER` - Focus on saving money
- `INVESTOR` - Focus on investments
- `DEBT_FREE` - Focus on clearing debt
- `BALANCED` - Balanced approach
- `EMERGENCY` - Strict budgeting mode

### FinancialGoal
- `SAVE_EMERGENCY` - Emergency fund
- `BUY_HOME` - Home purchase
- `RETIREMENT` - Retirement planning
- `DEBT_FREE` - Debt elimination
- `INVESTMENT` - Investment goals
- `EDUCATION` - Education funding
- `TRAVEL` - Travel savings
- `WEDDING` - Wedding expenses
- `BUSINESS` - Business startup

### SubscriptionStatus
- `ACTIVE` - Currently active
- `PAUSED` - Temporarily paused
- `CANCELLED` - Cancelled

## Key Features

### 1. **Cascading Deletes**
All user-related data is automatically deleted when a user account is deleted using `onDelete: Cascade`.

### 2. **Optimized Indices**
Strategic indices on:
- User email
- Transaction dates and types
- Stability mode and month
- Notification read status
- EMI end dates
- Subscription billing dates

### 3. **Timestamps**
All models include:
- `createdAt` - Automatic creation timestamp
- `updatedAt` - Automatic update timestamp (where applicable)

### 4. **Flexible Arrays**
- Financial goals (multiple goals per user)
- Transaction tags (flexible categorization)
- Insights and recommendations (AI-generated content)

### 5. **Strict Typing**
All enums are strictly typed for:
- Type safety
- Better IDE autocomplete
- Validation at database level

### 6. **Scalability**
- UUID primary keys for distributed systems
- Proper indexing for query performance
- Normalized data structure
- Efficient relations

## Database Relationships

```
User (1) ─── (1) Profile
  │
  ├─── (N) Transaction
  ├─── (N) EMI
  ├─── (N) Subscription
  ├─── (N) Leak
  ├─── (N) StabilityLog
  ├─── (N) Budget
  ├─── (N) SavingsGoal
  └─── (N) Notification
```

## Query Examples

### Get user with all financial data
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    profile: true,
    transactions: { orderBy: { date: 'desc' }, take: 10 },
    emis: true,
    subscriptions: { where: { status: 'ACTIVE' } },
    leaks: { where: { isResolved: false } },
    stabilityLogs: { orderBy: { month: 'desc' }, take: 6 },
  },
});
```

### Calculate monthly expenses
```typescript
const expenses = await prisma.transaction.aggregate({
  where: {
    userId,
    type: 'EXPENSE',
    date: { gte: startOfMonth, lte: endOfMonth },
  },
  _sum: { amount: true },
});
```

### Detect critical leaks
```typescript
const criticalLeaks = await prisma.leak.findMany({
  where: {
    userId,
    severity: 'CRITICAL',
    isResolved: false,
  },
  orderBy: { monthlyImpact: 'desc' },
});
```

## Migration Strategy

1. **Initial Setup**
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Schema Changes**
   ```bash
   npx prisma migrate dev --name description_of_change
   ```

3. **Production Deployment**
   ```bash
   npx prisma migrate deploy
   ```

## Best Practices

1. **Always use transactions** for related operations
2. **Index frequently queried fields**
3. **Use enums** for fixed sets of values
4. **Implement soft deletes** for critical data (if needed)
5. **Regular backups** of production database
6. **Monitor query performance** with Prisma metrics

## Future Enhancements

Potential additions:
- Investment tracking model
- Tax calculation model
- Bill reminders model
- Family/shared accounts
- Multi-currency support
- Audit logs
- Data export functionality

---

This schema is designed to be **production-ready**, **scalable**, and **maintainable** for a comprehensive finance intelligence application.
