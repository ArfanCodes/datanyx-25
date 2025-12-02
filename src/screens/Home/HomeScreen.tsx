import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Edit2, X, Check, Trophy, Gift, Zap, ClipboardList, AlertTriangle, PartyPopper, ShieldAlert } from 'lucide-react-native';
import { colors } from '../../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGamification } from '../../contexts/GamificationContext';
import { StreakBadge } from '../../components/StreakBadge';
import { MicroWinCard } from '../../components/MicroWinCard';
import { Mascot } from '../../components/Mascot';
import { BjorkMascot } from '../../components/BjorkMascot';
import { BjorkBadge } from '../../components/BjorkBadge';
import { useBjork } from '../../contexts/BjorkContext';
import { AchievementUnlockModal } from '../../components/AchievementUnlockModal';
import { UnexpectedEventButton } from '../../components/UnexpectedEventButton';
import { Achievements } from '../../types/gamification';
import { useRiskEngine } from '../../hooks/useRiskEngine';
import { RiskInputData } from '../../types/riskEngine';
import { calculateStabilityScore as calculateScoreFromFeatures } from '../../utils/riskUtils';

interface FixedExpense {
  name: string;
  amount: number;
  completed?: boolean;
}

interface ProfileData {
  monthlySalary: number;
  fixedExpenses: FixedExpense[];
  // New fields for Risk Engine
  employmentType?: string;
  variableExpenses?: number | null;
  emiCount?: number;
  investedValue?: number;
  creditScore?: number;
  dependentsCount?: number;
}

// Indian number formatting
const formatIndianNumber = (num: number): string => {
  if (!num || num === 0) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const HomeScreen = ({ navigation }: any) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [currentSalary, setCurrentSalary] = useState(0);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedSalary, setEditedSalary] = useState('');
  const [updatePermanently, setUpdatePermanently] = useState(false);

  // Micro-Savings State
  const [showMicroSavingCard, setShowMicroSavingCard] = useState(false);
  const [suggestedSaving, setSuggestedSaving] = useState(0);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');

  // Recovery Plan State
  const [hasRecoveryPlan, setHasRecoveryPlan] = useState(false);

  // Gamification
  const { profile: gamificationProfile, addMicroSaving, unlockAchievement, updateStreakOnAction } = useGamification();
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<keyof Achievements | null>(null);

  // Risk Engine
  const { predictRisk, riskResult, engineeredFeatures, loading: riskLoading } = useRiskEngine();

  // BJÖRK State
  const { bjorkState, triggerPositiveAction, triggerNegativeAction, updateBjorkState, toggleEmotion } = useBjork();

  // Load profile data
  useEffect(() => {
    loadProfileData();
    checkRecoveryPlanStatus();
  }, []);

  // Trigger Risk Prediction when profile data changes
  useEffect(() => {
    if (profileData) {
      const totalFixed = fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      const riskInput: RiskInputData = {
        employment_type: profileData.employmentType || 'Salaried',
        monthly_salary: currentSalary,
        fixed_expenses: totalFixed,
        variable_expenses: profileData.variableExpenses || null, // Let engine handle null
        emi_count: profileData.emiCount || 0,
        invested_value: profileData.investedValue || 0,
        credit_score: profileData.creditScore || 750,
        dependents_count: profileData.dependentsCount || 0,
      };

      predictRisk(riskInput);
    }
  }, [profileData, currentSalary, fixedExpenses, predictRisk]);

  const loadProfileData = async () => {
    try {
      const data = await AsyncStorage.getItem('@peso_profile_data');
      if (data) {
        const parsed: ProfileData = JSON.parse(data);
        setProfileData(parsed);
        setCurrentSalary(parsed.monthlySalary);

        // Load fixed expenses with completion status
        const expenses = parsed.fixedExpenses.map(exp => ({
          ...exp,
          completed: false,
        }));
        setFixedExpenses(expenses);
      } else {
        // Default data if none exists (for testing)
        const defaultData: ProfileData = {
          monthlySalary: 50000,
          fixedExpenses: [
            { name: 'Rent', amount: 15000 },
            { name: 'Groceries', amount: 5000 },
          ],
          employmentType: 'Salaried',
          variableExpenses: null,
          emiCount: 1,
          investedValue: 20000,
          creditScore: 750,
          dependentsCount: 1,
        };
        setProfileData(defaultData);
        setCurrentSalary(defaultData.monthlySalary);
        setFixedExpenses(defaultData.fixedExpenses);
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    }
  };

  const checkRecoveryPlanStatus = async () => {
    try {
      const recoveryPlanActive = await AsyncStorage.getItem('@peso_recovery_plan_active');
      setHasRecoveryPlan(recoveryPlanActive === 'true');
    } catch (error) {
      console.error('Failed to check recovery plan status:', error);
    }
  };

  const handleEditSalary = () => {
    setEditedSalary(currentSalary.toString());
    setUpdatePermanently(false);
    setShowEditModal(true);
  };

  const handleSaveSalary = async () => {
    const newSalary = parseInt(editedSalary, 10);

    if (isNaN(newSalary) || newSalary <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid salary amount.');
      return;
    }

    setCurrentSalary(newSalary);

    if (updatePermanently && profileData) {
      // Update permanently in AsyncStorage
      const updatedData = {
        ...profileData,
        monthlySalary: newSalary,
      };
      await AsyncStorage.setItem('@peso_profile_data', JSON.stringify(updatedData));
      setProfileData(updatedData);
    }

    setShowEditModal(false);
  };

  const toggleExpenseCompletion = async (index: number) => {
    const updated = [...fixedExpenses];
    updated[index].completed = !updated[index].completed;
    setFixedExpenses(updated);

    // If completing an expense, trigger streak update
    if (updated[index].completed) {
      await updateStreakOnAction();

      // Trigger BJÖRK positive action
      triggerPositiveAction();

      // Check for first win achievement
      if (!gamificationProfile.achievements.firstWin) {
        await unlockAchievement('firstWin');
        setUnlockedAchievement('firstWin');
        setShowAchievementModal(true);
      }
    }
  };

  // Round-up calculation
  const getRoundUpSaving = (amount: number): number => {
    const next = Math.ceil(amount / 100) * 100;
    const saving = next - amount;
    return saving === 0 ? 0 : saving;
  };

  // Handle Add Expense
  const handleAddExpense = () => {
    const amount = parseInt(expenseAmount, 10);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid expense amount.');
      return;
    }

    const roundUpSaving = getRoundUpSaving(amount);

    setExpenseAmount('');
    setShowAddExpenseModal(false);

    // Show micro-saving card if saving >= 5
    if (roundUpSaving >= 5) {
      setSuggestedSaving(roundUpSaving);
      setShowMicroSavingCard(true);
    }
  };

  // Handle Save Micro-Saving
  const handleSaveMicroSaving = async () => {
    // Use gamification context to add micro-saving
    await addMicroSaving(suggestedSaving);

    // Trigger BJÖRK positive action for saving
    triggerPositiveAction("Tiny win today!");

    // Hide the card and show success modal
    setShowMicroSavingCard(false);
    setShowSuccessModal(true);
  };

  // Handle Dismiss Micro-Saving
  const handleDismissMicroSaving = () => {
    setShowMicroSavingCard(false);
    setSuggestedSaving(0);
  };

  // Calculate Stability Score
  const calculateStabilityScore = (): { score: number; status: string; color: string; badgeBg: string } => {
    if (!profileData) return { score: 0, status: 'No Data', color: '#9A9A9A', badgeBg: '#F4F4F4' };

    // Use engineered features if available, otherwise fallback to simple calculation
    if (engineeredFeatures) {
      const score = calculateScoreFromFeatures(engineeredFeatures, currentSalary);

      let status = 'At Risk';
      let color = '#D9534F';
      let badgeBg = '#FFEAEA';

      if (score >= 80) {
        status = 'Excellent';
        color = '#32D483';
        badgeBg = '#E8F8F0';
      } else if (score >= 60) {
        status = 'Good';
        color = '#32D483';
        badgeBg = '#E8F8F0';
      } else if (score >= 40) {
        status = 'Fair';
        color = '#FFB84D';
        badgeBg = '#FFF4E5';
      }

      return { score, status, color, badgeBg };
    }

    // Fallback logic
    const totalFixedExpenses = fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const incomeVsExpenseRatio = currentSalary > 0 ? (currentSalary - totalFixedExpenses) / currentSalary : 0;
    const savingsRatio = currentSalary > 0 ? gamificationProfile.monthlyMicroSavingsTotal / currentSalary : 0;
    const expenseCoverage = totalFixedExpenses > 0 ? currentSalary / totalFixedExpenses : 0;

    // Calculate score (0-100)
    let score = 0;
    score += Math.min(incomeVsExpenseRatio * 50, 50); // Up to 50 points for income buffer
    score += Math.min(savingsRatio * 20, 20); // Up to 20 points for savings
    score += Math.min((expenseCoverage - 1) * 30, 30); // Up to 30 points for expense coverage

    score = Math.max(0, Math.min(100, Math.round(score)));

    let status = 'At Risk';
    let color = '#D9534F';
    let badgeBg = '#FFEAEA';

    if (score >= 80) {
      status = 'Excellent';
      color = '#32D483';
      badgeBg = '#E8F8F0';
    } else if (score >= 60) {
      status = 'Good';
      color = '#32D483';
      badgeBg = '#E8F8F0';
    } else if (score >= 40) {
      status = 'Fair';
      color = '#FFB84D';
      badgeBg = '#FFF4E5';
    }

    return { score, status, color, badgeBg };
  };

  const stabilityData = calculateStabilityScore();

  // Monitor financial state and update BJÖRK accordingly
  useEffect(() => {
    if (!profileData) return;

    const totalFixed = fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const isOverspending = stabilityData.score < 40;
    const hasHighEMI = (profileData.emiCount || 0) > 2;
    const incomeDropped = currentSalary < (profileData.monthlySalary || 0);

    // Trigger BJÖRK based on financial state
    if (hasRecoveryPlan || isOverspending || hasHighEMI || incomeDropped) {
      updateBjorkState('sad_messages', 'sad');
    } else if (stabilityData.score >= 60 && gamificationProfile.monthlyMicroSavingsTotal > 0) {
      updateBjorkState('happy_messages', 'normal');
    }
  }, [stabilityData.score, hasRecoveryPlan, profileData, currentSalary, gamificationProfile.monthlyMicroSavingsTotal, fixedExpenses, updateBjorkState]);

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'High Risk': return '#EF553B';
      case 'Moderate Risk': return '#FFA15A';
      case 'Low Risk': return '#00CC96';
      default: return '#9A9A9A';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Your month at a glance</Text>
            <Text style={styles.headerSubtitle}>Control your income and fixed expenses here.</Text>
          </View>
          <View style={styles.headerRight}>
            <BjorkBadge emotion={bjorkState.emotion} />
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Achievements')}
              activeOpacity={0.7}
            >
              <Trophy size={24} color={colors.buttonGreen} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('RewardsStore')}
              activeOpacity={0.7}
            >
              <Gift size={24} color={colors.buttonGreen} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Streak Badge */}
        <StreakBadge />

        {/* Stability Score Card */}
        <View style={styles.stabilityCard}>
          <View style={styles.stabilityHeader}>
            <Text style={styles.stabilityLabel}>Financial Stability</Text>
            <View style={[styles.stabilityBadge, { backgroundColor: stabilityData.badgeBg }]}>
              <Text style={[styles.stabilityStatus, { color: stabilityData.color }]}>
                {stabilityData.status}
              </Text>
            </View>
          </View>

          <View style={styles.stabilityScoreContainer}>
            <Text style={styles.stabilityScore}>{stabilityData.score}</Text>
            <Text style={styles.stabilityScoreMax}>/100</Text>
          </View>

          <View style={styles.stabilityProgressBar}>
            <View
              style={[
                styles.stabilityProgressFill,
                {
                  width: `${stabilityData.score}%`,
                  backgroundColor: stabilityData.color
                }
              ]}
            />
          </View>

          <Text style={styles.stabilityDescription}>
            Based on your income, expenses, and savings ratio
          </Text>
        </View>

        {/* Editable Income Card */}
        <View style={styles.incomeCard}>
          <View style={styles.incomeHeader}>
            <Text style={styles.incomeLabel}>Monthly Income</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditSalary}
              activeOpacity={0.7}
            >
              <Edit2 size={16} color={colors.buttonGreen} strokeWidth={2.5} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.incomeAmount}>₹ {formatIndianNumber(currentSalary)}</Text>
        </View>



        {/* Fixed Expenses Checklist */}
        <View style={styles.expensesCard}>
          <Text style={styles.expensesTitle}>Fixed Expenses This Month</Text>
          <View style={styles.expensesList}>
            {fixedExpenses.map((expense, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.expenseItem,
                  expense.completed && styles.expenseItemCompleted
                ]}
                onPress={() => toggleExpenseCompletion(index)}
                activeOpacity={0.7}
              >
                <View style={styles.expenseLeft}>
                  <View style={[
                    styles.checkbox,
                    expense.completed && styles.checkboxChecked
                  ]}>
                    {expense.completed && (
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    )}
                  </View>
                  <Text style={[
                    styles.expenseName,
                    expense.completed && styles.expenseNameCompleted
                  ]}>
                    {expense.name}
                  </Text>
                </View>
                <Text style={[
                  styles.expenseAmount,
                  expense.completed && styles.expenseAmountCompleted
                ]}>
                  ₹ {formatIndianNumber(expense.amount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Micro-Savings Indicator */}
        {gamificationProfile.monthlyMicroSavingsTotal > 0 && (
          <View style={styles.microSavingsIndicator}>
            <Zap size={20} color={colors.buttonGreen} />
            <Text style={styles.microSavingsText}>
              Micro-savings this month: <Text style={styles.microSavingsAmount}>₹{gamificationProfile.monthlyMicroSavingsTotal.toLocaleString('en-IN')}</Text>
            </Text>
          </View>
        )}

        {/* Micro-Win Card */}
        {showMicroSavingCard && (
          <MicroWinCard
            suggestedSaving={suggestedSaving}
            onSave={handleSaveMicroSaving}
            onDismiss={handleDismissMicroSaving}
          />
        )}

        {/* BJÖRK Mascot - Dynamic State-Driven */}
        <View style={styles.bjorkContainer}>
          <BjorkMascot
            emotion={bjorkState.emotion}
            message={bjorkState.message}
            size="medium"
            showMessage={true}
            animate={true}
            onPress={toggleEmotion}
          />
        </View>

        {/* Recovery Plan Banner */}
        {hasRecoveryPlan && (
          <View style={styles.recoveryBanner}>
            <ClipboardList size={24} color={colors.buttonGreen} style={{ marginRight: 12 }} />
            <View style={styles.recoveryBannerTextContainer}>
              <Text style={styles.recoveryBannerTitle}>Recovery Plan Active</Text>
              <Text style={styles.recoveryBannerText}>
                Recent unexpected event logged — follow your recovery plan
              </Text>
            </View>
          </View>
        )}

        {/* Unexpected Event Button */}
        <UnexpectedEventButton
          onPress={() => navigation.navigate('LogUnexpectedEvent')}
        />

        {/* Emergency Mode (Job Loss Mode) Button */}
        <TouchableOpacity
          style={styles.emergencyModeCard}
          onPress={() => navigation.navigate('EmergencyMode')}
          activeOpacity={0.85}
        >
          <View style={styles.emergencyIconContainer}>
            <AlertTriangle size={26} color="#A30000" />
          </View>
          <View style={styles.emergencyTextContainer}>
            <Text style={styles.emergencyTitle}>Emergency Mode (Job Loss Mode)</Text>
            <Text style={styles.emergencySubtext}>Activate Safe Mode to stabilize your finances instantly</Text>
          </View>
        </TouchableOpacity>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Add Expense Floating Button */}
      <TouchableOpacity
        style={styles.addExpenseButton}
        onPress={() => setShowAddExpenseModal(true)}
        activeOpacity={0.9}
      >
        <Text style={styles.addExpenseButtonText}>+ Add Expense</Text>
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <Modal
        visible={showAddExpenseModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddExpenseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Expense</Text>
              <TouchableOpacity
                onPress={() => setShowAddExpenseModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#6B6B6B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>Expense Amount</Text>
              <View style={styles.modalInputWrapper}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.modalInput}
                  value={expenseAmount}
                  onChangeText={(value) => {
                    const cleaned = value.replace(/[^0-9]/g, '');
                    setExpenseAmount(cleaned);
                  }}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  placeholderTextColor="#9A9A9A"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddExpense}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Salary Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Monthly Income</Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#6B6B6B" />
              </TouchableOpacity>
            </View>

            {/* Salary Input */}
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>New Salary Amount</Text>
              <View style={styles.modalInputWrapper}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editedSalary}
                  onChangeText={(value) => {
                    // Only allow numbers
                    const cleaned = value.replace(/[^0-9]/g, '');
                    setEditedSalary(cleaned);
                  }}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  placeholderTextColor="#9A9A9A"
                />
              </View>
            </View>

            {/* Radio Options */}
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setUpdatePermanently(false)}
                activeOpacity={0.7}
              >
                <View style={styles.radioCircle}>
                  {!updatePermanently && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>Apply only for this month</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setUpdatePermanently(true)}
                activeOpacity={0.7}
              >
                <View style={styles.radioCircle}>
                  {updatePermanently && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>Update my salary permanently</Text>
              </TouchableOpacity>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveSalary}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowSuccessModal(false);
          setSuggestedSaving(0);
        }}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
              <PartyPopper size={28} color={colors.buttonGreen} />
              <Text style={[styles.successModalTitle, { marginBottom: 0 }]}>You saved ₹{suggestedSaving}!</Text>
            </View>
            <Text style={styles.successModalSubtitle}>
              These tiny moves build your safety net.
            </Text>
            <TouchableOpacity
              style={styles.successModalButton}
              onPress={() => {
                setShowSuccessModal(false);
                setSuggestedSaving(0);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.successModalButtonText}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Achievement Unlock Modal */}
      <AchievementUnlockModal
        visible={showAchievementModal}
        achievementKey={unlockedAchievement}
        onClose={() => {
          setShowAchievementModal(false);
          setUnlockedAchievement(null);
        }}
      />
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
    paddingTop: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B6B6B',
    lineHeight: 22,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Risk Card
  riskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 2,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  riskTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  riskBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  riskMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  riskMetricLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    marginBottom: 4,
    fontWeight: '600',
  },
  riskMetricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  riskDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E8E8E8',
  },

  // Income Card
  incomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#32D483',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  incomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  incomeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B6B6B',
    letterSpacing: -0.2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#32D483',
  },
  incomeAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -1,
  },

  // Stability Score Card
  stabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  stabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  stabilityLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  stabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stabilityStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  stabilityScoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  stabilityScore: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -1.5,
  },
  stabilityScoreMax: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9A9A9A',
    marginLeft: 4,
  },
  stabilityProgressBar: {
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  stabilityProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  stabilityDescription: {
    fontSize: 13,
    color: '#6B6B6B',
    lineHeight: 19,
  },

  // Fixed Expenses Card
  expensesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  expensesTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 18,
    letterSpacing: -0.3,
  },
  expensesList: {
    gap: 14,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  expenseItemCompleted: {
    backgroundColor: '#E8F8F0',
    borderColor: '#32D483',
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: '#32D483',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#32D483',
    borderColor: '#32D483',
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    letterSpacing: -0.2,
  },
  expenseNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B6B6B',
    opacity: 0.6,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  expenseAmountCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B6B6B',
    opacity: 0.4,
  },

  // Mascot Container
  mascotContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },

  // Emergency Mode Card
  emergencyModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4E4',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
    minHeight: 80,
  },
  emergencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD0D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emergencyIcon: {
    fontSize: 26,
  },
  emergencyTextContainer: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#A30000',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  emergencySubtext: {
    fontSize: 13,
    color: '#6B6B6B',
    lineHeight: 18,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  closeButton: {
    padding: 4,
  },
  modalInputContainer: {
    marginBottom: 28,
  },
  modalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  modalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingHorizontal: 18,
    height: 60,
  },
  currencyPrefix: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 10,
  },
  modalInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  radioGroup: {
    gap: 14,
    marginBottom: 28,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
  },
  radioCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: '#32D483',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#32D483',
  },
  radioLabel: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 22,
  },
  saveButton: {
    backgroundColor: '#32D483',
    borderRadius: 14,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#32D483',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  // Micro-Savings Indicator
  microSavingsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  microSavingsIcon: {
    fontSize: 20,
    lineHeight: 20,
  },
  microSavingsText: {
    fontSize: 14,
    color: '#6B6B6B',
    flex: 1,
    lineHeight: 20,
  },
  microSavingsAmount: {
    fontWeight: '700',
    color: '#32D483',
  },

  // Add Expense Button
  addExpenseButton: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    backgroundColor: '#32D483',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#32D483',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  addExpenseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Success Modal
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    paddingTop: 32,
    paddingBottom: 32,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 10,
  },
  successModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  successModalSubtitle: {
    fontSize: 15,
    color: '#555555',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  successModalButton: {
    backgroundColor: '#32D483',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
    minHeight: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#32D483',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  successModalButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Recovery Plan Banner
  recoveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F0',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#32D483',
  },
  recoveryBannerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  recoveryBannerTextContainer: {
    flex: 1,
  },
  recoveryBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  recoveryBannerText: {
    fontSize: 13,
    color: '#6B6B6B',
    lineHeight: 18,
  },

  // BJÖRK Mascot Container
  bjorkContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    alignItems: 'center',
  },

  bottomPadding: {
    height: 120,
  },
});
