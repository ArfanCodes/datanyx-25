/**
 * Gamification Notification Messages
 * 
 * These are pre-defined notification messages for the gamification system.
 * Can be used with Expo Notifications or any push notification service.
 */

export interface NotificationMessage {
    title: string;
    body: string;
    data?: Record<string, any>;
}

/**
 * Streak reminder notifications
 */
export const getStreakReminderNotification = (streakCount: number): NotificationMessage => {
    const messages = [
        {
            title: '🔥 Keep Your Streak Alive!',
            body: `Don't lose your ${streakCount}-day stability streak! One small win today keeps it alive.`,
        },
        {
            title: '⚡ Streak Alert!',
            body: `You're on a ${streakCount}-day roll! Complete one task to keep it going.`,
        },
        {
            title: '💪 Stay Strong!',
            body: `${streakCount} days and counting! Don't break the chain now.`,
        },
    ];

    return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Achievement unlocked notifications
 */
export const getAchievementUnlockedNotification = (
    achievementTitle: string
): NotificationMessage => {
    return {
        title: '🏆 Achievement Unlocked!',
        body: `You earned '${achievementTitle}'! Nice progress!`,
        data: {
            type: 'achievement',
            achievement: achievementTitle,
        },
    };
};

/**
 * Reward teaser notifications
 */
export const getRewardTeaserNotification = (
    daysUntilReward: number
): NotificationMessage => {
    return {
        title: '🎁 Reward Coming Soon!',
        body: `Your ${7 - daysUntilReward}-day streak is ${daysUntilReward} day${daysUntilReward > 1 ? 's' : ''} away from unlocking a reward.`,
        data: {
            type: 'reward_teaser',
            daysRemaining: daysUntilReward,
        },
    };
};

/**
 * Inactivity notifications
 */
export const getInactivityNotification = (): NotificationMessage => {
    const messages = [
        {
            title: '😶 We Missed You!',
            body: 'Missed you yesterday. Do one tiny win today to restart your streak.',
        },
        {
            title: '👋 Come Back!',
            body: 'Your financial goals are waiting. Complete one quick task today!',
        },
        {
            title: '💚 Your Money Needs You',
            body: 'Take 2 minutes to check your finances and keep building stability.',
        },
    ];

    return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Milestone notifications
 */
export const getMilestoneNotification = (
    milestone: number,
    type: 'streak' | 'savings'
): NotificationMessage => {
    if (type === 'streak') {
        return {
            title: `🎉 ${milestone}-Day Streak!`,
            body: `Incredible! You've maintained your stability streak for ${milestone} days straight!`,
            data: {
                type: 'milestone',
                milestone,
                category: 'streak',
            },
        };
    } else {
        return {
            title: '💰 Savings Milestone!',
            body: `Amazing! You've saved ₹${milestone} in micro-savings this month!`,
            data: {
                type: 'milestone',
                milestone,
                category: 'savings',
            },
        };
    }
};

/**
 * Daily motivation notifications
 */
export const getDailyMotivationNotification = (): NotificationMessage => {
    const messages = [
        {
            title: '🌟 Good Morning!',
            body: 'Small steps today lead to big wins tomorrow. Check your finances!',
        },
        {
            title: '💪 You Got This!',
            body: 'Every rupee saved is a step toward financial freedom.',
        },
        {
            title: '🎯 Stay Focused',
            body: 'Your financial stability journey continues. Make one smart move today!',
        },
        {
            title: '✨ Build Your Future',
            body: 'Consistency beats perfection. Track one expense today!',
        },
    ];

    return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Micro-saving celebration notifications
 */
export const getMicroSavingCelebrationNotification = (
    amount: number
): NotificationMessage => {
    return {
        title: '🎉 Micro-Win!',
        body: `You just saved ₹${amount}! These small wins add up to big results.`,
        data: {
            type: 'micro_saving',
            amount,
        },
    };
};

/**
 * Weekly summary notifications
 */
export const getWeeklySummaryNotification = (
    streakCount: number,
    savingsTotal: number,
    achievementsUnlocked: number
): NotificationMessage => {
    return {
        title: '📊 Your Week in Review',
        body: `${streakCount}-day streak | ₹${savingsTotal} saved | ${achievementsUnlocked} achievement${achievementsUnlocked !== 1 ? 's' : ''} unlocked`,
        data: {
            type: 'weekly_summary',
            streak: streakCount,
            savings: savingsTotal,
            achievements: achievementsUnlocked,
        },
    };
};

/**
 * Schedule notification helper
 * 
 * Example usage with Expo Notifications:
 * 
 * import * as Notifications from 'expo-notifications';
 * 
 * const scheduleStreakReminder = async (streakCount: number) => {
 *   const notification = getStreakReminderNotification(streakCount);
 *   
 *   await Notifications.scheduleNotificationAsync({
 *     content: {
 *       title: notification.title,
 *       body: notification.body,
 *       data: notification.data,
 *     },
 *     trigger: {
 *       hour: 20, // 8 PM
 *       minute: 0,
 *       repeats: true,
 *     },
 *   });
 * };
 */

/**
 * Notification scheduling recommendations:
 * 
 * 1. Streak Reminder: Daily at 8 PM (if no activity that day)
 * 2. Daily Motivation: Daily at 9 AM
 * 3. Inactivity: After 24 hours of no activity
 * 4. Weekly Summary: Every Sunday at 6 PM
 * 5. Achievement Unlocked: Immediately when unlocked
 * 6. Milestone: Immediately when reached
 * 7. Micro-saving Celebration: Immediately after saving
 */

export const NOTIFICATION_SCHEDULE = {
    STREAK_REMINDER: { hour: 20, minute: 0 }, // 8 PM
    DAILY_MOTIVATION: { hour: 9, minute: 0 }, // 9 AM
    WEEKLY_SUMMARY: { weekday: 0, hour: 18, minute: 0 }, // Sunday 6 PM
    INACTIVITY_THRESHOLD_HOURS: 24,
};
