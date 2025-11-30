export interface Achievements {
    firstWin: boolean;
    stabilityStarter: boolean;
    leakHunter: boolean;
    consistencyHero: boolean;
    saverSpark: boolean;
}

export interface GamificationProfile {
    streakCount: number;
    bestStreak: number;
    lastActiveDate: string | null;
    monthlyMicroSavingsTotal: number;
    achievements: Achievements;
}

export interface AchievementDefinition {
    key: keyof Achievements;
    title: string;
    description: string;
    icon: string;
    unlockedIcon: string;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
    {
        key: 'firstWin',
        title: 'First Win',
        description: 'Complete your first task',
        icon: '🏆',
        unlockedIcon: '🏆',
    },
    {
        key: 'stabilityStarter',
        title: 'Stability Starter',
        description: 'Save ₹50 in micro-savings',
        icon: '💰',
        unlockedIcon: '💰',
    },
    {
        key: 'leakHunter',
        title: 'Leak Hunter',
        description: 'View your spending leaks',
        icon: '🔍',
        unlockedIcon: '🔍',
    },
    {
        key: 'consistencyHero',
        title: 'Consistency Hero',
        description: 'Maintain a 3-day streak',
        icon: '🔥',
        unlockedIcon: '🔥',
    },
    {
        key: 'saverSpark',
        title: 'Saver Spark',
        description: 'Save 3 micro-savings',
        icon: '⚡',
        unlockedIcon: '⚡',
    },
];

export type MascotMood = 'happy' | 'excited' | 'sad' | 'worried' | 'protective';

export interface MascotState {
    mood: MascotMood;
    message: string;
}
