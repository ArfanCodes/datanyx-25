export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

export enum TransactionCategory {
    // Income categories
    SALARY = 'salary',
    FREELANCE = 'freelance',
    INVESTMENT = 'investment',
    OTHER_INCOME = 'other_income',

    // Expense categories
    FOOD = 'food',
    TRANSPORT = 'transport',
    UTILITIES = 'utilities',
    RENT = 'rent',
    ENTERTAINMENT = 'entertainment',
    HEALTHCARE = 'healthcare',
    EDUCATION = 'education',
    SHOPPING = 'shopping',
    OTHER_EXPENSE = 'other_expense',
}

export enum RiskTolerance {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export enum LeakSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export enum LeakFrequency {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
}

export enum FinancialGoal {
    SAVE_EMERGENCY = 'save_emergency',
    BUY_HOME = 'buy_home',
    RETIREMENT = 'retirement',
    DEBT_FREE = 'debt_free',
    INVESTMENT = 'investment',
    EDUCATION = 'education',
    TRAVEL = 'travel',
}
