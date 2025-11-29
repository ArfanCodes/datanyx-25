import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, AlertTriangle, ArrowLeft } from 'lucide-react-native';
import { colors } from '../../utils/colors';

interface EssentialExpense {
  name: string;
  amount: number;
  checked: boolean;
}

interface EmergencyAction {
  id: number;
  text: string;
  completed: boolean;
}

export const EmergencyModeScreen = ({ navigation }: any) => {
  const [essentialExpenses, setEssentialExpenses] = useState<EssentialExpense[]>([
    { name: 'Rent', amount: 12000, checked: false },
    { name: 'Groceries', amount: 4000, checked: false },
    { name: 'Utility Bills', amount: 900, checked: false },
    { name: 'Medical', amount: 1300, checked: false },
  ]);

  const [emergencyActions, setEmergencyActions] = useState<EmergencyAction[]>([
    { id: 1, text: 'Cut non-essential subscriptions', completed: false },
    { id: 2, text: 'Pause shopping & food delivery', completed: false },
    { id: 3, text: 'Reduce daily spend to survival level', completed: false },
    { id: 4, text: 'Avoid using credit cards aggressively', completed: false },
    { id: 5, text: 'Review EMI impact for this month', completed: false },
  ]);

  const restrictedCategories = [
    'Shopping',
    'Entertainment',
    'Online ordering',
    'Travel',
    'Subscriptions',
  ];

  const toggleExpense = (index: number) => {
    const updated = [...essentialExpenses];
    updated[index].checked = !updated[index].checked;
    setEssentialExpenses(updated);
  };

  const toggleAction = (id: number) => {
    const updated = emergencyActions.map(action =>
      action.id === id ? { ...action, completed: !action.completed } : action
    );
    setEmergencyActions(updated);
  };

  const handleCreateSurvivalPlan = () => {
    Alert.alert(
      '30-Day Survival Plan',
      'Your personalized survival plan is being created. This will include:\n\n• Daily spending limits\n• Emergency fund allocation\n• Income replacement strategies\n• Debt management plan',
      [{ text: 'Continue', style: 'default' }]
    );
  };

  const handleExitEmergencyMode = () => {
    Alert.alert(
      'Exit Emergency Mode?',
      'Are you sure your income has returned? This will restore normal spending mode.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit Emergency Mode',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const totalMinimumNeed = essentialExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Header */}
        <View style={styles.emergencyHeader}>
          <View style={styles.emergencyIconContainer}>
            <Text style={styles.emergencyIconLarge}>🚨</Text>
          </View>
          <Text style={styles.emergencyTitle}>Emergency Mode Activated</Text>
          <Text style={styles.emergencySubtitle}>
            Your income has stopped. Peso will help stabilize your finances.
          </Text>
        </View>

        {/* Current Situation Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Situation Right Now</Text>

          {/* Current Income */}
          <View style={styles.situationRow}>
            <View style={styles.situationLeft}>
              <Text style={styles.situationLabel}>Current Income</Text>
              <Text style={styles.incomeZero}>₹0</Text>
              <Text style={styles.incomeSubtext}>(Income Stopped)</Text>
            </View>
            <View style={styles.joblessBadge}>
              <Text style={styles.joblessBadgeText}>JOBLESS</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Minimum Need */}
          <View style={styles.situationRow}>
            <View style={styles.situationFull}>
              <Text style={styles.situationLabel}>Your Minimum Monthly Need</Text>
              <Text style={styles.minimumAmount}>₹ {totalMinimumNeed.toLocaleString('en-IN')}</Text>
              <Text style={styles.minimumSubtext}>
                Based on your fixed expenses and essential spending.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Burn Rate */}
          <View style={styles.burnRatePanel}>
            <Text style={styles.burnRateLabel}>Estimated Survival Time</Text>
            <Text style={styles.burnRateValue}>2.4 months</Text>
            <Text style={styles.burnRateSubtext}>Based on current savings</Text>
          </View>
        </View>

        {/* Essential Expenses Checklist */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Essential Expenses to Focus On</Text>
          <View style={styles.expensesList}>
            {essentialExpenses.map((expense, index) => (
              <TouchableOpacity
                key={index}
                style={styles.expenseItem}
                onPress={() => toggleExpense(index)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.expenseCheckbox,
                  expense.checked && styles.expenseCheckboxChecked
                ]}>
                  {expense.checked && (
                    <Check size={16} color="#FFFFFF" strokeWidth={3} />
                  )}
                </View>
                <Text style={[
                  styles.expenseName,
                  expense.checked && styles.expenseNameChecked
                ]}>
                  {expense.name}
                </Text>
                <Text style={[
                  styles.expenseAmount,
                  expense.checked && styles.expenseAmountChecked
                ]}>
                  ₹ {expense.amount.toLocaleString('en-IN')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Restricted Spending */}
        <View style={styles.restrictedCard}>
          <Text style={styles.cardTitle}>Restricted Categories</Text>
          <View style={styles.restrictedGrid}>
            {restrictedCategories.map((category, index) => (
              <View key={index} style={styles.restrictedChip}>
                <AlertTriangle size={14} color="#A30000" strokeWidth={2} />
                <Text style={styles.restrictedChipText}>{category}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.restrictedWarning}>
            Not recommended in Emergency Mode
          </Text>
        </View>

        {/* Immediate Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Immediate Actions You Must Take</Text>
          <View style={styles.actionsList}>
            {emergencyActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionItem}
                onPress={() => toggleAction(action.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.actionCheckbox,
                  action.completed && styles.actionCheckboxCompleted
                ]}>
                  {action.completed && (
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  )}
                </View>
                <Text style={[
                  styles.actionText,
                  action.completed && styles.actionTextCompleted
                ]}>
                  {action.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Survival Plan Button */}
        <TouchableOpacity
          style={styles.survivalButton}
          onPress={handleCreateSurvivalPlan}
          activeOpacity={0.8}
        >
          <Text style={styles.survivalButtonText}>Create My 30-Day Survival Plan</Text>
        </TouchableOpacity>

        {/* Exit Emergency Mode */}
        <TouchableOpacity
          style={styles.exitButton}
          onPress={handleExitEmergencyMode}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color="#A30000" strokeWidth={2.5} />
          <Text style={styles.exitButtonText}>Exit Emergency Mode (When Income Returns)</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Emergency Header
  emergencyHeader: {
    backgroundColor: '#FFE4E4',
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emergencyIconContainer: {
    marginBottom: 16,
  },
  emergencyIconLarge: {
    fontSize: 56,
  },
  emergencyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#A30000',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emergencySubtitle: {
    fontSize: 15,
    color: '#1A1A1A',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    marginHorizontal: 24,
    marginTop: 28,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
    letterSpacing: -0.3,
  },

  // Situation Card
  situationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  situationLeft: {
    flex: 1,
  },
  situationFull: {
    flex: 1,
  },
  situationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B6B6B',
    marginBottom: 8,
  },
  incomeZero: {
    fontSize: 36,
    fontWeight: '700',
    color: '#A30000',
    letterSpacing: -1,
    marginBottom: 4,
  },
  incomeSubtext: {
    fontSize: 13,
    color: '#6B6B6B',
  },
  joblessBadge: {
    backgroundColor: '#A30000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  joblessBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  minimumAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  minimumSubtext: {
    fontSize: 13,
    color: '#6B6B6B',
    lineHeight: 19,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 20,
  },
  burnRatePanel: {
    backgroundColor: '#FFE4E4',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  burnRateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B6B6B',
    marginBottom: 8,
  },
  burnRateValue: {
    fontSize: 34,
    fontWeight: '700',
    color: '#A30000',
    letterSpacing: -1,
    marginBottom: 4,
  },
  burnRateSubtext: {
    fontSize: 12,
    color: '#6B6B6B',
  },

  // Essential Expenses
  expensesList: {
    gap: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  expenseCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#32D483',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseCheckboxChecked: {
    backgroundColor: '#32D483',
    borderColor: '#32D483',
  },
  expenseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  expenseNameChecked: {
    textDecorationLine: 'line-through',
    color: '#6B6B6B',
    opacity: 0.6,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  expenseAmountChecked: {
    textDecorationLine: 'line-through',
    color: '#6B6B6B',
    opacity: 0.4,
  },

  // Restricted Categories
  restrictedCard: {
    backgroundColor: '#F4F4F4',
    borderRadius: 18,
    padding: 24,
    marginHorizontal: 24,
    marginTop: 28,
  },
  restrictedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  restrictedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFCCCC',
    opacity: 0.7,
  },
  restrictedChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  restrictedWarning: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Emergency Actions
  actionsList: {
    gap: 18,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#32D483',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCheckboxCompleted: {
    backgroundColor: '#32D483',
    borderColor: '#32D483',
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  actionTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B6B6B',
    opacity: 0.6,
  },

  // Survival Plan Button
  survivalButton: {
    backgroundColor: '#32D483',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginTop: 32,
    shadowColor: '#32D483',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  survivalButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  // Exit Button
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 24,
    marginTop: 20,
    paddingVertical: 16,
  },
  exitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A30000',
  },

  bottomPadding: {
    height: 20,
  },
});
