import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { colors } from '../utils/colors';
import { spacing } from '../theme/spacing';

interface TipCardProps {
  tip: string;
}

export const TipCard: React.FC<TipCardProps> = ({ tip }) => {
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>💡 Tip</Text>
      <Text style={styles.text}>{tip}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E3F2FD',
  },
  label: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
});
