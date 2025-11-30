import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get user's gamification profile
 */
export const getGamificationProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId },
            select: {
                streakCount: true,
                bestStreak: true,
                lastActiveDate: true,
                monthlyMicroSavingsTotal: true,
                achievements: true,
            },
        });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error('Error fetching gamification profile:', error);
        res.status(500).json({ error: 'Failed to fetch gamification profile' });
    }
};

/**
 * Update streak on action
 */
export const updateStreak = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const lastActive = profile.lastActiveDate
            ? new Date(profile.lastActiveDate).toISOString().split('T')[0]
            : null;

        let newStreakCount = profile.streakCount;

        if (!lastActive) {
            // First action ever
            newStreakCount = 1;
        } else if (lastActive === today) {
            // Already active today, no change
            return res.json({
                success: true,
                data: {
                    streakCount: profile.streakCount,
                    bestStreak: profile.bestStreak,
                    lastActiveDate: profile.lastActiveDate,
                },
            });
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

        const updatedProfile = await prisma.profile.update({
            where: { userId },
            data: {
                streakCount: newStreakCount,
                bestStreak: newBestStreak,
                lastActiveDate: now,
            },
            select: {
                streakCount: true,
                bestStreak: true,
                lastActiveDate: true,
            },
        });

        res.json({
            success: true,
            data: updatedProfile,
        });
    } catch (error) {
        console.error('Error updating streak:', error);
        res.status(500).json({ error: 'Failed to update streak' });
    }
};

/**
 * Unlock achievement
 */
export const unlockAchievement = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { achievementKey } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!achievementKey) {
            return res.status(400).json({ error: 'Achievement key is required' });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Parse achievements JSON
        const achievements = typeof profile.achievements === 'string'
            ? JSON.parse(profile.achievements)
            : profile.achievements;

        // Check if already unlocked
        if (achievements[achievementKey]) {
            return res.json({
                success: true,
                message: 'Achievement already unlocked',
                data: achievements,
            });
        }

        // Unlock the achievement
        achievements[achievementKey] = true;

        const updatedProfile = await prisma.profile.update({
            where: { userId },
            data: {
                achievements: JSON.stringify(achievements),
            },
            select: {
                achievements: true,
            },
        });

        res.json({
            success: true,
            message: 'Achievement unlocked!',
            data: updatedProfile.achievements,
        });
    } catch (error) {
        console.error('Error unlocking achievement:', error);
        res.status(500).json({ error: 'Failed to unlock achievement' });
    }
};

/**
 * Add micro-saving
 */
export const addMicroSaving = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { amount } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Valid amount is required' });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const newTotal = profile.monthlyMicroSavingsTotal + amount;

        const updatedProfile = await prisma.profile.update({
            where: { userId },
            data: {
                monthlyMicroSavingsTotal: newTotal,
            },
            select: {
                monthlyMicroSavingsTotal: true,
            },
        });

        res.json({
            success: true,
            data: updatedProfile,
        });
    } catch (error) {
        console.error('Error adding micro-saving:', error);
        res.status(500).json({ error: 'Failed to add micro-saving' });
    }
};

/**
 * Reset monthly micro-savings (to be called at the start of each month)
 */
export const resetMonthlyMicroSavings = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const updatedProfile = await prisma.profile.update({
            where: { userId },
            data: {
                monthlyMicroSavingsTotal: 0,
            },
            select: {
                monthlyMicroSavingsTotal: true,
            },
        });

        res.json({
            success: true,
            message: 'Monthly micro-savings reset',
            data: updatedProfile,
        });
    } catch (error) {
        console.error('Error resetting micro-savings:', error);
        res.status(500).json({ error: 'Failed to reset micro-savings' });
    }
};
