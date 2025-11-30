import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGamification } from '../contexts/GamificationContext';
import { MascotMood } from '../types/gamification';

interface MascotProps {
    size?: 'small' | 'medium' | 'large';
}

const MASCOT_EMOJIS: Record<MascotMood, string> = {
    happy: '😊',
    excited: '🤩',
    sad: '😢',
    worried: '😰',
    protective: '🛡️',
};

export const Mascot: React.FC<MascotProps> = ({ size = 'medium' }) => {
    const { getMascotState } = useGamification();
    const mascotState = getMascotState();

    const sizeStyles = {
        small: {
            container: styles.containerSmall,
            emoji: styles.emojiSmall,
            message: styles.messageSmall,
        },
        medium: {
            container: styles.containerMedium,
            emoji: styles.emojiMedium,
            message: styles.messageMedium,
        },
        large: {
            container: styles.containerLarge,
            emoji: styles.emojiLarge,
            message: styles.messageLarge,
        },
    };

    const currentSize = sizeStyles[size];

    return (
        <View style={[styles.container, currentSize.container]}>
            <Text style={[styles.emoji, currentSize.emoji]}>
                {MASCOT_EMOJIS[mascotState.mood]}
            </Text>
            <Text style={[styles.message, currentSize.message]}>
                {mascotState.message}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
    containerSmall: {
        padding: 12,
        borderRadius: 12,
    },
    containerMedium: {
        padding: 20,
        borderRadius: 20,
    },
    containerLarge: {
        padding: 28,
        borderRadius: 24,
    },
    emoji: {
        marginBottom: 12,
    },
    emojiSmall: {
        fontSize: 32,
        marginBottom: 8,
    },
    emojiMedium: {
        fontSize: 48,
        marginBottom: 12,
    },
    emojiLarge: {
        fontSize: 64,
        marginBottom: 16,
    },
    message: {
        textAlign: 'center',
        color: '#1A1A1A',
        fontWeight: '600',
    },
    messageSmall: {
        fontSize: 12,
        lineHeight: 16,
    },
    messageMedium: {
        fontSize: 14,
        lineHeight: 20,
    },
    messageLarge: {
        fontSize: 16,
        lineHeight: 22,
    },
});
