import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { ACHIEVEMENT_DEFINITIONS } from '../types/gamification';
import { Achievements } from '../types/gamification';
import { Trophy, Coins, Search, Flame, Zap, Sparkles, PartyPopper } from 'lucide-react-native';
import { colors } from '../utils/colors';

interface AchievementUnlockModalProps {
    visible: boolean;
    achievementKey: keyof Achievements | null;
    onClose: () => void;
}

const ACHIEVEMENT_ICONS: Record<keyof Achievements, React.ElementType> = {
    firstWin: Trophy,
    stabilityStarter: Coins,
    leakHunter: Search,
    consistencyHero: Flame,
    saverSpark: Zap,
};

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
    visible,
    achievementKey,
    onClose,
}) => {
    if (!achievementKey) return null;

    const achievement = ACHIEVEMENT_DEFINITIONS.find((a) => a.key === achievementKey);
    if (!achievement) return null;

    const Icon = ACHIEVEMENT_ICONS[achievementKey];

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
                        <Sparkles size={32} color={colors.buttonGreen} />
                        <Sparkles size={40} color={colors.growth} />
                        <Sparkles size={32} color={colors.buttonGreen} />
                    </View>

                    <Text style={styles.title}>Achievement Unlocked!</Text>

                    <View style={styles.achievementCard}>
                        <Icon size={64} color={colors.buttonGreen} weight="fill" />
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <Text style={styles.buttonText}>Awesome!</Text>
                            <PartyPopper size={20} color={colors.white} />
                        </View>
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
        alignItems: 'center',
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
    achievementTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
        marginTop: 16,
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

