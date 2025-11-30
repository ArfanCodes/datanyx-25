export type UnexpectedEventType =
    | 'SALARY_DELAY'
    | 'SALARY_CUT'
    | 'MEDICAL'
    | 'EMERGENCY_TRAVEL'
    | 'CAR_BIKE_REPAIR'
    | 'INCOME_NOT_RECEIVED'
    | 'FAMILY_EMERGENCY'
    | 'OTHERS';

export interface UnexpectedEvent {
    id: string;
    eventType: UnexpectedEventType;
    moneyLost: number;
    remainingBalance: number;
    reason: string;
    isRecurring: boolean;
    createdAt: Date;
}

export interface RecoveryPlan {
    todayActions: string[];
    weekActions: string[];
    recoverySteps: string[];
    stabilityReturnDays: number;
    updatedRunway: number;
    updatedStabilityScore: number;
    safeSpendLimit: number;
}

export const EVENT_TYPE_LABELS: Record<UnexpectedEventType, string> = {
    SALARY_DELAY: 'Salary Delay',
    SALARY_CUT: 'Salary Cut',
    MEDICAL: 'Medical Emergency',
    EMERGENCY_TRAVEL: 'Emergency Travel',
    CAR_BIKE_REPAIR: 'Car/Bike Repair',
    INCOME_NOT_RECEIVED: 'Income Not Received',
    FAMILY_EMERGENCY: 'Family Emergency',
    OTHERS: 'Others',
};
