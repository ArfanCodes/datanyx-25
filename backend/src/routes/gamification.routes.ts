import { Router } from 'express';
import {
    getGamificationProfile,
    updateStreak,
    unlockAchievement,
    addMicroSaving,
    resetMonthlyMicroSavings,
} from '../controllers/gamification.controller';
import { verifyAuthToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(verifyAuthToken);

// Get gamification profile
router.get('/profile', getGamificationProfile);

// Update streak
router.post('/streak', updateStreak);

// Unlock achievement
router.post('/achievement', unlockAchievement);

// Add micro-saving
router.post('/micro-saving', addMicroSaving);

// Reset monthly micro-savings
router.post('/reset-monthly', resetMonthlyMicroSavings);

export default router;
