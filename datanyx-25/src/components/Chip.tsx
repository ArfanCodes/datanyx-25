import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { View } from 'react-native';
import { colors } from '../utils/colors';
import { spacing } from '../theme/spacing';

interface ChipProps {
    label: string;
    backgroundColor?: string;
    textColor?: string;
    style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
    label,
    backgroundColor = colors.accentBlue,
    textColor = colors.textDark,
    style
}) => {
    return (
        <View style={[styles.chip, { backgroundColor }, style]}>
            <Text style={[styles.text, { color: textColor }]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
    },
});
