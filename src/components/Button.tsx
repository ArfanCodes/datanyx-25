import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../utils/colors';
import { spacing } from '../theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', style }) => {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      style={[styles.container, isPrimary ? styles.primary : styles.secondary, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.buttonGreen,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.buttonGreen,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textPrimary: {
    color: colors.white,
  },
  textSecondary: {
    color: colors.buttonGreen,
  },
});
