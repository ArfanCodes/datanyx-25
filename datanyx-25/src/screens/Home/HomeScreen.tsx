import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, AlertTriangle, X } from 'lucide-react-native';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AddExpenseModal, ExpenseData } from '../../components/AddExpenseModal';
import { colors } from '../../utils/colors';
import { useUserStore } from '../../store/userStore';

const EMERGENCY_RED = '#E53935';
const CRISIS_BG = '#FFF4F4';
const CRISIS_CARD_BG = '#FFE4E4';
const CRISIS_PINK = '#FFD8E8';

export const HomeScreen = () => {
  const { name } = useUserStore();
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] = useState(false);

  const handleAddExpense = async (expenseData: ExpenseData) => {
    try {
      // Import dynamically to avoid circular dependencies
      const { addTransaction } = await import('../../utils/transactions');
      
      await addTransaction(
        expenseData.amount,
        expenseData.category,
        expenseData.paymentMethod,
        expenseData.note,
        'expense'
      );
      
      console.log('Expense saved successfully:', expenseData);
      // TODO: Invalidate React Query cache to refresh Home & Spending screens
      // queryClient.invalidateQueries(['transactions']);
    } catch (error) {
      console.error('Failed to save expense:', error);
    }
  };

  // Normal Mode UI
  const renderNormalMode = () => (
    <>
      {/* 1. Greeting Section */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingText}>Hello, {name}</Text>
        <Text style={styles.subGreetingText}>Here's your money status today.</Text>
      </View>

      {/* 2. Unified Money Dashboard Card */}
      <Card style={styles.dashboardCard}>
        <View style={styles.dashboardRow}>
          <View style={styles.dashboardItem}>
            <Text style={styles.dashboardLabel}>Net Position</Text>
            <Text style={[styles.dashboardValue, { color: colors.buttonGreen }]}>+₹12,450</Text>
          </View>
          <View style={styles.dashboardItem}>
            <Text style={styles.dashboardLabel}>Savings</Text>
            <Text style={styles.dashboardValue}>₹8,200</Text>
          </View>
        </View>
        
        <View style={styles.divider} />

        <View style={styles.dashboardRow}>
          <View style={styles.dashboardItem}>
            <Text style={styles.dashboardLabel}>Inflow</Text>
            <Text style={styles.dashboardValue}>₹5,000</Text>
          </View>
          <View style={styles.dashboardItem}>
            <Text style={styles.dashboardLabel}>Outflow</Text>
            <Text style={styles.dashboardValue}>₹3,200</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.dashboardRow}>
          <View style={styles.dashboardItem}>
            <Text style={styles.dashboardLabel}>Total EMIs</Text>
            <Text style={styles.dashboardValue}>₹1,100</Text>
          </View>
          <View style={styles.dashboardItem}>
            <Text style={styles.dashboardLabel}>Credit Usage</Text>
            <Text style={styles.dashboardValue}>15%</Text>
          </View>
        </View>
      </Card>

      {/* 3. Financial Stability Score Card */}
      <Card style={styles.stabilityCard}>
        <View style={styles.stabilityHeader}>
          <Text style={styles.stabilityTitle}>Stability: 68 / 100</Text>
          <View style={[styles.modeChip, { backgroundColor: colors.accentBlue }]}>
            <Text style={styles.modeChipText}>Normal</Text>
          </View>
        </View>
        <Text style={styles.stabilitySubtitle}>Your finances are moderately stable.</Text>
      </Card>

      {/* 4. Emergency Fund Radar / Runway */}
      <Card style={styles.runwayCard}>
        <Text style={styles.runwayTitle}>Runway: 4.2 months</Text>
        <Text style={styles.runwaySubtitle}>Based on your burn rate and current savings.</Text>
      </Card>

      {/* 5. Early Warning Snapshot */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.warningScroll}
        contentContainerStyle={styles.warningContainer}
      >
        <View style={[styles.warningChip, { backgroundColor: colors.accentYellow }]}>
          <Text style={styles.warningText}>Spending 20% faster than usual</Text>
        </View>
        <View style={[styles.warningChip, { backgroundColor: colors.accentPink }]}>
          <Text style={styles.warningText}>High EMI pressure</Text>
        </View>
      </ScrollView>

      {/* 6. AI Mode Indicator */}
      <Card style={styles.aiModeCard}>
        <View style={styles.aiModeContent}>
          <Text style={styles.aiModeTitle}>Normal Mode</Text>
          <Text style={styles.aiModeDesc}>Balanced growth and spending.</Text>
        </View>
      </Card>

      {/* 7. Emergency Mode Button - RED ALERT */}
      <TouchableOpacity 
        style={styles.emergencyButton}
        onPress={() => setIsEmergencyMode(true)}
        activeOpacity={0.8}
      >
        <AlertTriangle color={colors.white} size={20} strokeWidth={2.5} />
        <Text style={styles.emergencyButtonText}>Activate Emergency Mode</Text>
      </TouchableOpacity>
    </>
  );

  // Emergency Mode UI (Crisis/Safe Mode)
  const renderEmergencyMode = () => (
    <>
      {/* Exit Emergency Mode Button */}
      <TouchableOpacity 
        style={styles.exitEmergencyButton}
        onPress={() => setIsEmergencyMode(false)}
        activeOpacity={0.8}
      >
        <X color={colors.white} size={18} strokeWidth={2.5} />
        <Text style={styles.exitEmergencyButtonText}>Exit Emergency Mode</Text>
      </TouchableOpacity>

      {/* Crisis Mode Active Banner */}
      <Card style={[styles.crisisCard, { backgroundColor: CRISIS_PINK }]}>
        <View style={styles.crisisHeader}>
          <Text style={styles.crisisTitle}>Crisis Mode Active</Text>
          <View style={[styles.modeChip, { backgroundColor: CRISIS_PINK, borderWidth: 1, borderColor: EMERGENCY_RED }]}>
            <Text style={[styles.modeChipText, { color: EMERGENCY_RED }]}>Crisis</Text>
          </View>
        </View>
        <Text style={styles.crisisSubtitle}>Your dashboard has been simplified to help you survive.</Text>
      </Card>

      {/* A. Survival Runway - BIG CARD */}
      <Card style={[styles.survivalCard, { backgroundColor: CRISIS_CARD_BG }]}>
        <Text style={styles.survivalLabel}>Survival Runway</Text>
        <Text style={styles.survivalValue}>You can survive 4.2 months</Text>
        <Text style={styles.survivalSubtext}>Based on your current savings and essential expenses only.</Text>
      </Card>

      {/* B. Emergency Priorities Card */}
      <Card style={[styles.prioritiesCard, { backgroundColor: CRISIS_PINK }]}>
        <Text style={styles.prioritiesTitle}>Cut these expenses immediately:</Text>
        <View style={styles.prioritiesList}>
          <View style={styles.priorityItem}>
            <View style={styles.priorityBullet} />
            <Text style={styles.priorityText}>Subscriptions</Text>
          </View>
          <View style={styles.priorityItem}>
            <View style={styles.priorityBullet} />
            <Text style={styles.priorityText}>Food delivery</Text>
          </View>
          <View style={styles.priorityItem}>
            <View style={styles.priorityBullet} />
            <Text style={styles.priorityText}>Shopping</Text>
          </View>
          <View style={styles.priorityItem}>
            <View style={styles.priorityBullet} />
            <Text style={styles.priorityText}>BNPL payments</Text>
          </View>
        </View>
      </Card>

      {/* D. Essentials-Only Expense Overview */}
      <Card style={styles.essentialsCard}>
        <Text style={styles.essentialsTitle}>Essential Expenses Only</Text>
        <View style={styles.divider} />
        
        <View style={styles.essentialRow}>
          <Text style={styles.essentialLabel}>Rent</Text>
          <Text style={styles.essentialValue}>₹1,200</Text>
        </View>
        <View style={styles.essentialRow}>
          <Text style={styles.essentialLabel}>Groceries</Text>
          <Text style={styles.essentialValue}>₹400</Text>
        </View>
        <View style={styles.essentialRow}>
          <Text style={styles.essentialLabel}>Transport</Text>
          <Text style={styles.essentialValue}>₹150</Text>
        </View>
        <View style={styles.essentialRow}>
          <Text style={styles.essentialLabel}>Medicines</Text>
          <Text style={styles.essentialValue}>₹80</Text>
        </View>
        
        <View style={styles.divider} />
        <View style={styles.essentialRow}>
          <Text style={[styles.essentialLabel, { fontWeight: '700' }]}>Total Essentials</Text>
          <Text style={[styles.essentialValue, { fontWeight: '700', color: EMERGENCY_RED }]}>₹1,830</Text>
        </View>
      </Card>
    </>
  );

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        isEmergencyMode && { backgroundColor: CRISIS_BG }
      ]} 
      edges={['top']}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isEmergencyMode ? renderEmergencyMode() : renderNormalMode()}

        {/* Bottom padding for FAB and TabBar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Add Expense Button - Hide in Emergency Mode */}
      {!isEmergencyMode && (
        <TouchableOpacity 
          style={styles.fab} 
          activeOpacity={0.8}
          onPress={() => setIsAddExpenseModalVisible(true)}
        >
          <Plus color={colors.white} size={32} strokeWidth={2.5} />
        </TouchableOpacity>
      )}

      {/* Add Expense Modal */}
      <AddExpenseModal
        visible={isAddExpenseModalVisible}
        onClose={() => setIsAddExpenseModalVisible(false)}
        onSave={handleAddExpense}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
  },
  greetingSection: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  subGreetingText: {
    fontSize: 16,
    color: '#666666',
  },
  dashboardCard: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dashboardItem: {
    flex: 1,
  },
  dashboardLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
  },
  dashboardValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  stabilityCard: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  stabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stabilityTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  modeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDark,
  },
  stabilitySubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  runwayCard: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  runwayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  runwaySubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  warningScroll: {
    marginBottom: 24,
  },
  warningContainer: {
    paddingRight: 24,
  },
  warningChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textDark,
  },
  aiModeCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accentBlue,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  aiModeContent: {
    justifyContent: 'center',
  },
  aiModeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  aiModeDesc: {
    fontSize: 14,
    color: '#666666',
  },
  emergencyButton: {
    backgroundColor: EMERGENCY_RED,
    borderRadius: 14,
    paddingVertical: 18,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: EMERGENCY_RED,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  exitEmergencyButton: {
    backgroundColor: colors.buttonGreen,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exitEmergencyButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  crisisCard: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  crisisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  crisisTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  crisisSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  survivalCard: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  survivalLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  survivalValue: {
    fontSize: 26,
    fontWeight: '700',
    color: EMERGENCY_RED,
    marginBottom: 8,
  },
  survivalSubtext: {
    fontSize: 14,
    color: '#666666',
  },
  prioritiesCard: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  prioritiesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  prioritiesList: {
    gap: 10,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: EMERGENCY_RED,
    marginRight: 10,
  },
  priorityText: {
    fontSize: 14,
    color: colors.textDark,
  },
  essentialsCard: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  essentialsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  essentialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  essentialLabel: {
    fontSize: 15,
    color: '#666666',
  },
  essentialValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.buttonGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
