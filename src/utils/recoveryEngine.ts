import { RecoveryPlan } from '../types/unexpectedEvents';

/**
 * Calculate updated runway (days until money runs out)
 */
export const calculateUpdatedRunway = (
    income: number,
    fixedExpenses: number,
    variableExpenses: number,
    shockAmount: number,
    remainingBalance: number
): number => {
    const monthlyExpenses = fixedExpenses + variableExpenses;
    const dailyExpenses = monthlyExpenses / 30;

    if (dailyExpenses === 0) return 999; // Infinite runway if no expenses

    const runway = Math.floor(remainingBalance / dailyExpenses);
    return Math.max(0, runway);
};

/**
 * Calculate updated stability score after shock
 */
export const calculateUpdatedStabilityScore = (
    previousScore: number,
    shockSeverity: number,
    income: number
): number => {
    // Shock severity as percentage of monthly income
    const shockImpact = (shockSeverity / income) * 100;

    let scoreReduction = 0;
    if (shockImpact >= 50) {
        scoreReduction = 40; // Severe shock
    } else if (shockImpact >= 30) {
        scoreReduction = 25; // Major shock
    } else if (shockImpact >= 15) {
        scoreReduction = 15; // Moderate shock
    } else {
        scoreReduction = 5; // Minor shock
    }

    const newScore = Math.max(0, previousScore - scoreReduction);
    return Math.round(newScore);
};

/**
 * Calculate safe spending limit per day
 */
export const calculateSafeSpendLimit = (
    remainingMoney: number,
    daysLeft: number
): number => {
    if (daysLeft <= 0) return 0;

    // Reserve 20% as buffer
    const spendableMoney = remainingMoney * 0.8;
    const dailyLimit = spendableMoney / daysLeft;

    return Math.floor(dailyLimit);
};

/**
 * Generate comprehensive recovery plan
 */
export const generateRecoveryPlan = (
    moneyLost: number,
    remainingBalance: number,
    monthlyIncome: number,
    fixedExpenses: number,
    variableExpenses: number,
    currentStabilityScore: number
): RecoveryPlan => {
    const updatedRunway = calculateUpdatedRunway(
        monthlyIncome,
        fixedExpenses,
        variableExpenses,
        moneyLost,
        remainingBalance
    );

    const updatedStabilityScore = calculateUpdatedStabilityScore(
        currentStabilityScore,
        moneyLost,
        monthlyIncome
    );

    const daysInMonth = 30;
    const safeSpendLimit = calculateSafeSpendLimit(remainingBalance, daysInMonth);

    // Calculate recovery timeline
    const shockSeverity = (moneyLost / monthlyIncome) * 100;
    let stabilityReturnDays = 7;
    if (shockSeverity >= 50) {
        stabilityReturnDays = 30;
    } else if (shockSeverity >= 30) {
        stabilityReturnDays = 21;
    } else if (shockSeverity >= 15) {
        stabilityReturnDays = 14;
    }

    // Generate today's actions
    const todayActions: string[] = [];
    if (remainingBalance < monthlyIncome * 0.3) {
        todayActions.push('Move ₹200 into safety buffer');
    }
    todayActions.push('Pause one subscription');
    todayActions.push('Freeze one discretionary category');
    if (moneyLost > monthlyIncome * 0.2) {
        todayActions.push('Review all upcoming payments');
    }

    // Generate this week's actions
    const weekActions: string[] = [
        'Avoid one lifestyle spend',
        'Reduce delivery orders',
        'Complete 2 coach tasks',
    ];

    if (shockSeverity >= 30) {
        weekActions.push('Skip one non-essential payment');
        weekActions.push('Find one income opportunity');
    }

    // Generate recovery steps
    const recoverySteps: string[] = [];
    const dailySavingNeeded = Math.ceil(moneyLost / stabilityReturnDays);

    recoverySteps.push(`Save ₹${dailySavingNeeded}/day for ${stabilityReturnDays} days`);

    if (moneyLost >= 5000) {
        recoverySteps.push('Take one micro freelance gig');
    }

    const spendReduction = Math.min(30, Math.ceil(shockSeverity / 2));
    recoverySteps.push(`Reduce spend by ${spendReduction}% in 2 categories`);

    if (shockSeverity >= 20) {
        recoverySteps.push('Skip 1 non-essential payment this cycle');
    }

    // Generate 30-Day Survival Plan
    const survivalPlan: string[] = [
        'Week 1: Cut all non-essential spending (eating out, entertainment)',
        'Week 2: Negotiate or defer one large bill payment',
        'Week 3: Look for short-term income sources (selling items, gigs)',
        'Week 4: Re-evaluate budget and start rebuilding emergency fund',
    ];

    if (shockSeverity >= 40) {
        survivalPlan[0] = 'Week 1: STRICT FREEZE on all spending except food/rent';
        survivalPlan[1] = 'Week 2: Contact lenders for EMI restructuring';
    }

    // Specific advice for very high shock (likely job loss)
    if (shockSeverity >= 80) {
        survivalPlan[0] = 'Week 1: File for unemployment / insurance immediately';
        survivalPlan[1] = 'Week 2: Update resume and contact 5 recruiters/day';
        survivalPlan[2] = 'Week 3: Apply for gig work to cover basic food costs';
        survivalPlan[3] = 'Week 4: Review assets to liquidate if needed';
    }

    return {
        todayActions,
        weekActions,
        survivalPlan,
        recoverySteps,
        stabilityReturnDays,
        updatedRunway,
        updatedStabilityScore,
        safeSpendLimit,
    };
};

/**
 * Determine if Safety Mode should be triggered
 */
export const shouldTriggerSafetyMode = (
    stabilityScore: number,
    runway: number
): boolean => {
    return stabilityScore < 40 || runway < 7;
};

/**
 * Determine if Crisis Mode should be triggered
 */
export const shouldTriggerCrisisMode = (
    stabilityScore: number,
    runway: number
): boolean => {
    return stabilityScore < 20 || runway < 3;
};
