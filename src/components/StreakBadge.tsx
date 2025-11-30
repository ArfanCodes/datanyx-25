import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import { useGamification } from '../contexts/GamificationContext';

export const StreakBadge = () => {
    const { profile } = useGamification();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={() => setShowModal(true)}
                activeOpacity={0.8}
            >
                <View style={styles.content}>
                    <Text style={styles.fireIcon}>🔥</Text>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Stability Streak</Text>
                        <Text style={styles.streakCount}>{profile.streakCount} Days</Text>
                    </View>
                </View>
                {profile.bestStreak > 0 && (
                    <View style={styles.bestStreakBadge}>
                        <Text style={styles.bestStreakText}>Best: {profile.bestStreak}</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Streak History Modal */}
            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>🔥 Your Streak</Text>
                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                style={styles.closeButton}
                            >
                                <X size={24} color="#6B6B6B" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.streakStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{profile.streakCount}</Text>
                                <Text style={styles.statLabel}>Current Streak</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{profile.bestStreak}</Text>
                                <Text style={styles.statLabel}>Best Streak</Text>
                            </View>
                        </View>

                        <View style={styles.streakInfo}>
                            <Text style={styles.infoTitle}>Keep it going! 💪</Text>
                            <Text style={styles.infoText}>
                                Complete any positive action daily to maintain your streak:
                            </Text>
                            <View style={styles.actionList}>
                                <Text style={styles.actionItem}>• Complete a coach task</Text>
                                <Text style={styles.actionItem}>• Save micro-savings</Text>
                                <Text style={styles.actionItem}>• Review your spending leaks</Text>
                            </View>
                        </View>

                        {profile.lastActiveDate && (
                            <Text style={styles.lastActive}>
                                Last active: {new Date(profile.lastActiveDate).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </Text>
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#FFB84D',
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    fireIcon: {
        fontSize: 32,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B6B6B',
        marginBottom: 4,
    },
    streakCount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.5,
    },
    bestStreakBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#FFF4E5',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    bestStreakText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFB84D',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 28,
        width: '100%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    closeButton: {
        padding: 4,
    },
    streakStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#F4F4F4',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFB84D',
        marginBottom: 6,
    },
    statLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B6B6B',
    },
    statDivider: {
        width: 1,
        height: 50,
        backgroundColor: '#E8E8E8',
    },
    streakInfo: {
        backgroundColor: '#FFF4E5',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#6B6B6B',
        lineHeight: 20,
        marginBottom: 12,
    },
    actionList: {
        gap: 6,
    },
    actionItem: {
        fontSize: 14,
        color: '#1A1A1A',
        lineHeight: 20,
    },
    lastActive: {
        fontSize: 12,
        color: '#9A9A9A',
        textAlign: 'center',
    },
});
