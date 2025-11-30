import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { ACHIEVEMENT_DEFINITIONS } from '../types/gamification';
import { Achievements } from '../types/gamification';

interface AchievementUnlockModalProps {
    visible: boolean;
    achievementKey: keyof Achievements | null;
    onClose: () => void;
}

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
    visible,
    achievementKey,
    onClose,
}) => {
    if (!achievementKey) return null;

    const achievement = ACHIEVEMENT_DEFINITIONS.find((a) => a.key === achievementKey);
    if (!achievement) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.sparkles}>
                        <Text style={styles.sparkle}>✨</Text>
                        <Text style={styles.sparkle}>✨</Text>
                        <Text style={styles.sparkle}>✨</Text>
                    </View>

                    <Text style={styles.title}>Achievement Unlocked!</Text>

                    <View style={styles.achievementCard}>
                        <Text style={styles.icon}>{achievement.unlockedIcon}</Text>
                        <Text style={styles.achievementTitle}>{achievement.title}</Text>
                        <Text style={styles.achievementDescription}>
                            {achievement.description}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Awesome! 🎉</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 32,
        width: '100%',
        maxWidth: 360,
        alignItems: 'center',
    },
    sparkles: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
    },
    sparkle: {
        fontSize: 32,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 24,
        textAlign: 'center',
    },
    achievementCard: {
        backgroundColor: '#E8F8F0',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#32D483',
    },
    icon: {
        fontSize: 64,
        marginBottom: 16,
    },
    achievementTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
    },
    achievementDescription: {
        fontSize: 14,
        color: '#6B6B6B',
        textAlign: 'center',
        lineHeight: 20,
    },
    button: {
        backgroundColor: '#32D483',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 32,
        width: '100%',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});
