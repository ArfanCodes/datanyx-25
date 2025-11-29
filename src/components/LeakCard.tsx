import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { colors } from '../utils/colors';
import { spacing } from '../theme/spacing';
import { AlertTriangle } from 'lucide-react-native';

interface LeakCardProps {
  title: string;
  amount: string;
}

export const LeakCard: React.FC<LeakCardProps> = ({ title, amount }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.iconContainer}>
        <AlertTriangle size={24} color={colors.crisis} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.amount}>{amount}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: spacing.md,
    backgroundColor: colors.accentPink,
    padding: spacing.sm,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '600',
  },
  amount: {
    fontSize: 14,
    color: colors.crisis,
    marginTop: 2,
  },
});
