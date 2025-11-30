import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievements, GamificationProfile, MascotMood, MascotState } from '../types/gamification';

interface GamificationContextType {
    profile: GamificationProfile;
    updateStreakOnAction: () => Promise<void>;
    unlockAchievement: (key: keyof Achievements) => Promise<void>;
    addMicroSaving: (amount: number) => Promise<void>;
    getMascotState: () => MascotState;
    refreshProfile: () => Promise<void>;
    microSavingsCount: number;
}

const defaultProfile: GamificationProfile = {
    streakCount: 0,
    bestStreak: 0,
    lastActiveDate: null,
    monthlyMicroSavingsTotal: 0,
    achievements: {
        firstWin: false,
        stabilityStarter: false,
        leakHunter: false,
        consistencyHero: false,
        saverSpark: false,
    },
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<GamificationProfile>(defaultProfile);
    const [microSavingsCount, setMicroSavingsCount] = useState(0);

    // Load profile from AsyncStorage on mount
    useEffect(() => {
        loadProfile();
        loadMicroSavingsCount();
    }, []);

    const loadProfile = async () => {
        try {
            const stored = await AsyncStorage.getItem('@peso_gamification_profile');
            if (stored) {
                setProfile(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load gamification profile:', error);
        }
    };

    const loadMicroSavingsCount = async () => {
        try {
            const count = await AsyncStorage.getItem('@peso_micro_savings_count');
            if (count) {
                setMicroSavingsCount(parseInt(count, 10));
            }
        } catch (error) {
            console.error('Failed to load micro-savings count:', error);
        }
    };

    const saveProfile = async (updatedProfile: GamificationProfile) => {
        try {
            await AsyncStorage.setItem('@peso_gamification_profile', JSON.stringify(updatedProfile));
            setProfile(updatedProfile);
        } catch (error) {
            console.error('Failed to save gamification profile:', error);
        }
    };

    const updateStreakOnAction = async () => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const lastActive = profile.lastActiveDate ? new Date(profile.lastActiveDate).toISOString().split('T')[0] : null;

        let newStreakCount = profile.streakCount;

        if (!lastActive) {
            // First action ever
            newStreakCount = 1;
        } else if (lastActive === today) {
            // Already active today, no change
            return;
        } else {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastActive === yesterdayStr) {
                // Consecutive day
                newStreakCount = profile.streakCount + 1;
            } else {
                // Streak broken
                newStreakCount = 1;
            }
        }

        const newBestStreak = Math.max(newStreakCount, profile.bestStreak);

        const updatedProfile = {
            ...profile,
            streakCount: newStreakCount,
            bestStreak: newBestStreak,
            lastActiveDate: now.toISOString(),
        };

        await saveProfile(updatedProfile);

        // Check for consistency hero achievement
        if (newStreakCount >= 3 && !profile.achievements.consistencyHero) {
            await unlockAchievement('consistencyHero');
        }
    };

    const unlockAchievement = async (key: keyof Achievements) => {
        if (profile.achievements[key]) {
            // Already unlocked
            return;
        }

        const updatedAchievements = {
            ...profile.achievements,
            [key]: true,
        };

        const updatedProfile = {
            ...profile,
            achievements: updatedAchievements,
        };

        await saveProfile(updatedProfile);

        // TODO: Show achievement unlocked notification/modal
        console.log(`🏆 Achievement Unlocked: ${key}`);
    };

    const addMicroSaving = async (amount: number) => {
        const newTotal = profile.monthlyMicroSavingsTotal + amount;
        const newCount = microSavingsCount + 1;

        const updatedProfile = {
            ...profile,
            monthlyMicroSavingsTotal: newTotal,
        };

        await saveProfile(updatedProfile);
        await AsyncStorage.setItem('@peso_micro_savings_count', newCount.toString());
        setMicroSavingsCount(newCount);

        // Update streak
        await updateStreakOnAction();

        // Check achievements
        if (newTotal >= 50 && !profile.achievements.stabilityStarter) {
            await unlockAchievement('stabilityStarter');
        }

        if (newCount >= 3 && !profile.achievements.saverSpark) {
            await unlockAchievement('saverSpark');
        }

        // Check for first win
        if (!profile.achievements.firstWin) {
            await unlockAchievement('firstWin');
        }
    };

    const getMascotState = (): MascotState => {
        const { streakCount, monthlyMicroSavingsTotal, achievements } = profile;

        // Check if any achievement was recently unlocked
        const hasAchievements = Object.values(achievements).some(val => val);
        if (hasAchievements && streakCount > 0) {
            return {
                mood: 'excited',
                message: 'You\'re doing amazing! Keep it up!',
            };
        }

        // Check streak status
        if (streakCount >= 3) {
            return {
                mood: 'happy',
                message: `${streakCount} day streak! You're on fire!`,
            };
        }

        // Check if streak was missed
        const now = new Date();
        const lastActive = profile.lastActiveDate ? new Date(profile.lastActiveDate) : null;
        if (lastActive) {
            const daysSinceActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
            if (daysSinceActive > 1) {
                return {
                    mood: 'sad',
                    message: 'Missed you! Let\'s get back on track.',
                };
            }
        }

        // Default happy state
        return {
            mood: 'happy',
            message: 'Ready to build your financial stability!',
        };
    };

    const refreshProfile = async () => {
        await loadProfile();
        await loadMicroSavingsCount();
    };

    return (
        <GamificationContext.Provider
            value={{
                profile,
                updateStreakOnAction,
                unlockAchievement,
                addMicroSaving,
                getMascotState,
                refreshProfile,
                microSavingsCount,
            }}
        >
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error('useGamification must be used within GamificationProvider');
    }
    return context;
};
