import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Lock } from 'lucide-react-native';
import { useGamification } from '../../contexts/GamificationContext';

interface RewardItem {
    id: string;
    title: string;
    description: string;
    icon: string;
    requiredStreak?: number;
    comingSoon: boolean;
}

const REWARDS: RewardItem[] = [
    {
        id: '1',
        title: '7-Day Streak Reward',
        description: 'Unlock exclusive financial tips and insights',
        icon: '🏆',
        requiredStreak: 7,
        comingSoon: true,
    },
    {
        id: '2',
        title: 'SIP Booster Ideas',
        description: 'Personalized investment recommendations',
        icon: '📈',
        comingSoon: true,
    },
    {
        id: '3',
        title: 'Premium Emergency Plan',
        description: 'Advanced emergency fund templates',
        icon: '🛡️',
        comingSoon: true,
    },
    {
        id: '4',
        title: 'Budget Optimizer',
        description: 'AI-powered budget optimization tools',
        icon: '💡',
        comingSoon: true,
    },
    {
        id: '5',
        title: 'Debt Freedom Roadmap',
        description: 'Personalized debt elimination strategy',
        icon: '🎯',
        comingSoon: true,
    },
    {
        id: '6',
        title: 'Wealth Builder Pack',
        description: 'Advanced wealth-building resources',
        icon: '💰',
        comingSoon: true,
    },
];

export const RewardsStoreScreen = ({ navigation }: any) => {
    const { profile } = useGamification();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Rewards Store</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcon}>🎁</Text>
                    <Text style={styles.infoTitle}>Earn Rewards!</Text>
                    <Text style={styles.infoText}>
                        Keep building your streak and completing achievements to unlock
                        exclusive rewards and premium features.
                    </Text>
                    <View style={styles.streakInfo}>
                        <Text style={styles.streakInfoText}>
                            Current Streak: <Text style={styles.streakInfoValue}>{profile.streakCount} days</Text>
                        </Text>
                    </View>
                </View>

                {/* Rewards Grid */}
                <View style={styles.rewardsGrid}>
                    {REWARDS.map((reward) => {
                        const isLocked = reward.requiredStreak
                            ? profile.streakCount < reward.requiredStreak
                            : true;

                        return (
                            <View key={reward.id} style={styles.rewardCard}>
                                <View style={styles.rewardIconContainer}>
                                    <Text style={styles.rewardIcon}>{reward.icon}</Text>
                                    {isLocked && (
                                        <View style={styles.lockOverlay}>
                                            <Lock size={20} color="#FFFFFF" />
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.rewardTitle}>{reward.title}</Text>
                                <Text style={styles.rewardDescription}>{reward.description}</Text>

                                {reward.comingSoon && (
                                    <View style={styles.comingSoonBadge}>
                                        <Text style={styles.comingSoonText}>Coming Soon</Text>
                                    </View>
                                )}

                                {reward.requiredStreak && (
                                    <View style={styles.requirementBadge}>
                                        <Text style={styles.requirementText}>
                                            {isLocked
                                                ? `Unlock at ${reward.requiredStreak} day streak`
                                                : 'Available!'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Motivation */}
                <View style={styles.motivationCard}>
                    <Text style={styles.motivationIcon}>🚀</Text>
                    <Text style={styles.motivationTitle}>More Rewards Coming!</Text>
                    <Text style={styles.motivationText}>
                        We're constantly adding new rewards and features. Keep checking back
                        and maintain your streak to be first in line!
                    </Text>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    placeholder: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },

    // Info Card
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,
    },
    infoIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    infoTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#6B6B6B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
    },
    streakInfo: {
        backgroundColor: '#FFF4E5',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    streakInfoText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B6B6B',
    },
    streakInfoValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFB84D',
    },

    // Rewards Grid
    rewardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
    },
    rewardCard: {
        width: '47%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,
    },
    rewardIconContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    rewardIcon: {
        fontSize: 48,
    },
    lockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rewardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 6,
    },
    rewardDescription: {
        fontSize: 12,
        color: '#6B6B6B',
        textAlign: 'center',
        lineHeight: 17,
        marginBottom: 12,
    },
    comingSoonBadge: {
        backgroundColor: '#EDE9FF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginBottom: 8,
    },
    comingSoonText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9B59B6',
    },
    requirementBadge: {
        backgroundColor: '#FFF4E5',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    requirementText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FFB84D',
        textAlign: 'center',
    },

    // Motivation Card
    motivationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,
    },
    motivationIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    motivationTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    motivationText: {
        fontSize: 14,
        color: '#6B6B6B',
        textAlign: 'center',
        lineHeight: 20,
    },

    bottomPadding: {
        height: 40,
    },
});
