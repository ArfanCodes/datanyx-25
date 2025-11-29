export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    phone?: string;
}

export interface OnboardingData {
    monthlyIncome: number;
    currency: string;
    financialGoals: string[];
    riskTolerance: string;
    age?: number;
    occupation?: string;
    city?: string;
}

export interface DashboardSummary {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    savingsRate: number;
    stabilityScore: number;
    leaksDetected: number;
}
