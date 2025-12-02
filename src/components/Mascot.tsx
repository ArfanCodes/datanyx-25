import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGamification } from '../contexts/GamificationContext';
import { MascotMood } from '../types/gamification';
import { Smile, Star, Frown, AlertCircle, Shield } from 'lucide-react-native';
import { colors } from '../utils/colors';

interface MascotProps {
    size?: 'small' | 'medium' | 'large';
}

const MASCOT_ICONS: Record<MascotMood, React.ElementType> = {
    happy: Smile,
    excited: Star,
    sad: Frown,
    worried: AlertCircle,
    protective: Shield,
};

const MOOD_COLORS: Record<MascotMood, string> = {
    happy: colors.buttonGreen,
    excited: colors.growth,
    sad: colors.textLight,
    worried: colors.crisis,
    protective: '#4A90E2',
};

export const Mascot: React.FC<MascotProps> = ({ size = 'medium' }) => {
    const { getMascotState } = useGamification();
    const mascotState = getMascotState();

    const sizeStyles = {
        small: {
            container: styles.containerSmall,
            iconSize: 32,
            message: styles.messageSmall,
        },
        medium: {
            container: styles.containerMedium,
            iconSize: 48,
            message: styles.messageMedium,
        },
        large: {
            container: styles.containerLarge,
            iconSize: 64,
            message: styles.messageLarge,
        },
    };

    const currentSize = sizeStyles[size];
    const Icon = MASCOT_ICONS[mascotState.mood];
    const iconColor = MOOD_COLORS[mascotState.mood];

    return (
        <View style={[styles.container, currentSize.container]}>
            <View style={styles.iconContainer}>
                <Icon size={currentSize.iconSize} color={iconColor} weight="fill" />
            </View>
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
    iconContainer: {
        marginBottom: 12,
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

