import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useGamification } from '../../contexts/GamificationContext';
import { ACHIEVEMENT_DEFINITIONS } from '../../types/gamification';

export const AchievementsScreen = ({ navigation }: any) => {
    const { profile } = useGamification();

    const unlockedCount = Object.values(profile.achievements).filter(Boolean).length;
    const totalCount = ACHIEVEMENT_DEFINITIONS.length;

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
                <Text style={styles.headerTitle}>Achievements</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress Summary */}
                <View style={styles.progressCard}>
                    <Text style={styles.progressTitle}>Your Progress</Text>
                    <View style={styles.progressStats}>
                        <Text style={styles.progressCount}>
                            {unlockedCount} / {totalCount}
                        </Text>
                        <Text style={styles.progressLabel}>Achievements Unlocked</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${(unlockedCount / totalCount) * 100}%` },
                            ]}
                        />
                    </View>
                </View>

                {/* Achievements Grid */}
                <View style={styles.achievementsGrid}>
                    {ACHIEVEMENT_DEFINITIONS.map((achievement) => {
                        const isUnlocked = profile.achievements[achievement.key];
                        return (
                            <View
                                key={achievement.key}
                                style={[
                                    styles.achievementCard,
                                    isUnlocked && styles.achievementCardUnlocked,
                                ]}
                            >
                                <Text style={styles.achievementIcon}>
                                    {isUnlocked ? achievement.unlockedIcon : '🔒'}
                                </Text>
                                <Text
                                    style={[
                                        styles.achievementTitle,
                                        !isUnlocked && styles.achievementTitleLocked,
                                    ]}
                                >
                                    {achievement.title}
                                </Text>
                                <Text
                                    style={[
                                        styles.achievementDescription,
                                        !isUnlocked && styles.achievementDescriptionLocked,
                                    ]}
                                >
                                    {achievement.description}
                                </Text>
                                {isUnlocked && (
                                    <View style={styles.unlockedBadge}>
                                        <Text style={styles.unlockedBadgeText}>✓ Unlocked</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Motivation Message */}
                <View style={styles.motivationCard}>
                    <Text style={styles.motivationIcon}>🌟</Text>
                    <Text style={styles.motivationTitle}>Keep Going!</Text>
                    <Text style={styles.motivationText}>
                        Every achievement brings you closer to financial stability. Complete
                        tasks, save money, and build healthy habits!
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

    // Progress Card
    progressCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,
    },
    progressTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    progressStats: {
        alignItems: 'center',
        marginBottom: 16,
    },
    progressCount: {
        fontSize: 40,
        fontWeight: '700',
        color: '#32D483',
        marginBottom: 6,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B6B6B',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E8E8E8',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#32D483',
        borderRadius: 4,
    },

    // Achievements Grid
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
    },
    achievementCard: {
        width: '47%',
        backgroundColor: '#E8E8E8',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.05)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
    },
    achievementCardUnlocked: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#32D483',
    },
    achievementIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    achievementTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 6,
    },
    achievementTitleLocked: {
        color: '#9A9A9A',
    },
    achievementDescription: {
        fontSize: 12,
        color: '#6B6B6B',
        textAlign: 'center',
        lineHeight: 17,
    },
    achievementDescriptionLocked: {
        color: '#9A9A9A',
    },
    unlockedBadge: {
        marginTop: 12,
        backgroundColor: '#E8F8F0',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    unlockedBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#32D483',
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
