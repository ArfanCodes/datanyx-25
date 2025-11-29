import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { colors } from '../utils/colors';
import { spacing } from '../theme/spacing';

interface StatCardProps {
  label: string;
  value: string;
  type?: 'neutral' | 'growth' | 'crisis' | 'wealth';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, type = 'neutral' }) => {
  let valueColor = colors.textDark;
  if (type === 'growth') valueColor = colors.growth;
  if (type === 'crisis') valueColor = colors.crisis;
  if (type === 'wealth') valueColor = colors.wealth;

  return (
    <Card>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
  },
});
