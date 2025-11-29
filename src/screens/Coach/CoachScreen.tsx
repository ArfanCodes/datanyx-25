import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors } from '../../utils/colors';
import { spacing } from '../../theme/spacing';

type AIMode = 'Crisis' | 'Normal' | 'Growth';

interface MicroAction {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
}

interface IncomeIdea {
  id: string;
  title: string;
  description: string;
  color: string;
}

export const CoachScreen = () => {
  // Mock data - replace with actual state management
  const [aiMode] = useState<AIMode>('Normal');
  const [microActions, setMicroActions] = useState<MicroAction[]>([
    {
      id: '1',
      title: 'Cancel this unused subscription',
      subtitle: 'Netflix Premium - ₹649/month',
      completed: false,
    },
    {
      id: '2',
      title: 'Move ₹500 to emergency fund',
      subtitle: 'Build your safety net for unexpected expenses',
      completed: false,
    },
    {
      id: '3',
      title: 'Limit food delivery to 2x this week',
      subtitle: 'You spent ₹2,400 last week on delivery',
      completed: false,
    },
  ]);

  const incomeIdeas: IncomeIdea[] = [
    {
      id: '1',
      title: 'Weekend freelance gigs',
      description: '2-4 hrs of tutoring or design work',
      color: colors.accentBlue,
    },
    {
      id: '2',
      title: 'Sell unused items',
      description: 'Quick cash from things you don\'t use',
      color: colors.accentYellow,
    },
    {
      id: '3',
      title: 'Use your coding skills',
      description: 'Small projects on freelance platforms',
      color: colors.accentPink,
    },
  ];

  const toggleAction = (id: string) => {
    setMicroActions(prev =>
      prev.map(action =>
        action.id === id ? { ...action, completed: !action.completed } : action
      )
    );
  };

  const getModeConfig = () => {
    switch (aiMode) {
      case 'Crisis':
        return {
          label: 'Crisis',
          icon: '⚠️',
          background: colors.accentPink,
          focus: 'survival & safety',
        };
      case 'Normal':
        return {
          label: 'Normal',
          icon: '⚖️',
          background: colors.accentBlue,
          focus: 'balance & control',
        };
      case 'Growth':
        return {
          label: 'Growth',
          icon: '🌱',
          background: '#D7F7E7',
          focus: 'growth & investing',
        };
    }
  };

  const modeConfig = getModeConfig();
  const isStable = aiMode !== 'Crisis';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Money Coach</Text>
        <Text style={styles.subtitle}>Small steps you can take today.</Text>
      </View>

      {/* Mode Banner */}
      <View style={[styles.modeBanner, { backgroundColor: modeConfig.background }]}>
        <View style={styles.modeContent}>
          <View style={styles.modeLeft}>
            <Text style={styles.modeIcon}>{modeConfig.icon}</Text>
            <Text style={styles.modeLabel}>{modeConfig.label}</Text>
          </View>
        </View>
        <Text style={styles.modeFocus}>
          We're focusing on: {modeConfig.focus}.
        </Text>
      </View>

      {/* Micro-Actions List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Do these today</Text>
        {microActions.map(action => (
          <Card key={action.id} style={styles.actionCard}>
            <View style={styles.actionContent}>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.markDoneButton,
                  action.completed && styles.markDoneButtonCompleted,
                ]}
                onPress={() => toggleAction(action.id)}
              >
                <Text
                  style={[
                    styles.markDoneText,
                    action.completed && styles.markDoneTextCompleted,
                  ]}
                >
                  {action.completed ? '✓ Done' : 'Mark Done'}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>

      {/* Emergency Mode Section */}
      {aiMode === 'Crisis' && (
        <View style={styles.section}>
          <Card style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>🚨 Emergency Playbook</Text>

            <View style={styles.emergencySection}>
              <Text style={styles.emergencyLabel}>Cut these first:</Text>
              <Text style={styles.emergencyItem}>• Subscriptions</Text>
              <Text style={styles.emergencyItem}>• Online shopping</Text>
              <Text style={styles.emergencyItem}>• Food delivery</Text>
            </View>

            <View style={styles.emergencySection}>
              <Text style={styles.emergencyLabel}>Keep paying:</Text>
              <Text style={styles.emergencyItem}>• Rent</Text>
              <Text style={styles.emergencyItem}>• EMIs</Text>
              <Text style={styles.emergencyItem}>• Essentials</Text>
            </View>

            <Button
              title="Open Full Emergency Plan"
              onPress={() => {
                // Navigate to Emergency screen
                console.log('Navigate to Emergency screen');
              }}
              style={styles.emergencyButton}
            />
          </Card>
        </View>
      )}

      {/* Auto-Investment Launcher */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ready to Invest?</Text>
        <Card style={[styles.investmentCard, { backgroundColor: isStable ? '#D7F7E7' : colors.white }]}>
          {isStable ? (
            <>
              <Text style={styles.investmentText}>
                Based on your stability and runway, you can safely invest ₹2,000 – ₹5,000 per month.
              </Text>
              <View style={styles.investmentButtons}>
                <Button
                  title="View suggested SIP ranges"
                  onPress={() => console.log('View SIP ranges')}
                  variant="secondary"
                  style={styles.investmentButton}
                />
                <Button
                  title="Open broker app"
                  onPress={() => console.log('Open broker')}
                  style={styles.investmentButton}
                />
              </View>
            </>
          ) : (
            <Text style={styles.investmentTextNeutral}>
              We'll suggest investments once things are more stable.
            </Text>
          )}
        </Card>
      </View>

      {/* Income Growth Pathway */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Income Growth Ideas</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.incomeCarousel}
        >
          {incomeIdeas.map(idea => (
            <TouchableOpacity
              key={idea.id}
              style={[styles.incomeCard, { backgroundColor: idea.color }]}
              onPress={() => console.log('Income idea:', idea.title)}
            >
              <Text style={styles.incomeTitle}>{idea.title}</Text>
              <Text style={styles.incomeDescription}>{idea.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Personalisation Note */}
      <View style={styles.personalisationContainer}>
        <Text style={styles.personalisationText}>
          Because you're a <Text style={styles.personalisationBold}>Software Engineer</Text> at{' '}
          <Text style={styles.personalisationBold}>Early Career</Text>, we're focusing on:
        </Text>
        <Text style={styles.personalisationItem}>• Building emergency fund</Text>
        <Text style={styles.personalisationItem}>• Controlling lifestyle inflation</Text>
        <Text style={styles.personalisationItem}>• Starting small investments</Text>
      </View>

      {/* Bottom padding for tab bar */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  modeBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 12,
    padding: spacing.md,
  },
  modeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  modeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  modeFocus: {
    fontSize: 14,
    color: colors.textDark,
    opacity: 0.8,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  actionCard: {
    marginBottom: spacing.sm,
  },
  actionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
    marginRight: spacing.md,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  markDoneButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.buttonGreen,
    backgroundColor: 'transparent',
  },
  markDoneButtonCompleted: {
    backgroundColor: colors.buttonGreen,
    borderColor: colors.buttonGreen,
  },
  markDoneText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.buttonGreen,
  },
  markDoneTextCompleted: {
    color: colors.white,
  },
  emergencyCard: {
    backgroundColor: colors.accentPink,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  emergencySection: {
    marginBottom: spacing.md,
  },
  emergencyLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  emergencyItem: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 22,
    opacity: 0.8,
  },
  emergencyButton: {
    marginTop: spacing.sm,
  },
  investmentCard: {
    padding: spacing.lg,
  },
  investmentText: {
    fontSize: 15,
    color: colors.textDark,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  investmentTextNeutral: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
    textAlign: 'center',
  },
  investmentButtons: {
    gap: spacing.sm,
  },
  investmentButton: {
    marginBottom: spacing.sm,
  },
  incomeCarousel: {
    paddingRight: spacing.lg,
  },
  incomeCard: {
    width: 200,
    padding: spacing.md,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  incomeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  incomeDescription: {
    fontSize: 14,
    color: colors.textDark,
    opacity: 0.8,
    lineHeight: 20,
  },
  personalisationContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  personalisationText: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  personalisationBold: {
    fontWeight: '600',
    color: colors.textDark,
  },
  personalisationItem: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 100,
  },
});
