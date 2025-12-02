import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { colors } from '../../utils/colors';
import { spacing } from '../../theme/spacing';
import { LogOut } from 'lucide-react-native';

type AIMode = 'Crisis' | 'Normal' | 'Growth';
type LifeStage = 'Student' | 'Early Career' | 'Mid Career' | 'Family' | 'Other';
type JobType = 'Salaried' | 'Freelancer' | 'Gig' | 'Self-employed' | 'Other';

interface ConnectionStatus {
  name: string;
  icon: string;
  connected: boolean;
}

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  
  const [aiMode, setAiMode] = useState<AIMode>('Normal');

  // Profile data
  const [lifeStage, setLifeStage] = useState<LifeStage>('Early Career');
  const [jobType, setJobType] = useState<JobType>('Salaried');
  const [dependents, setDependents] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState('50000');
  const [salaryCreditDate, setSalaryCreditDate] = useState('1');

  // Connections
  const [connections, setConnections] = useState<ConnectionStatus[]>([
    { name: 'Bank Accounts', icon: '🏦', connected: true },
    { name: 'Cards & EMI', icon: '💳', connected: true },
    { name: 'UPI & Wallets', icon: '📱', connected: false },
    { name: 'BNPL / Pay Later', icon: '🛍️', connected: false },
  ]);

  // Notification preferences
  const [notifDebtEMI, setNotifDebtEMI] = useState(true);
  const [notifOverspending, setNotifOverspending] = useState(true);
  const [notifDailyTips, setNotifDailyTips] = useState(true);
  const [notifWeeklySummary, setNotifWeeklySummary] = useState(false);

  // Privacy settings
  const [allowAnonymousData, setAllowAnonymousData] = useState(true);

  // Modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getModeColor = (mode: AIMode) => {
    switch (mode) {
      case 'Crisis': return colors.accentPink;
      case 'Normal': return colors.accentBlue;
      case 'Growth': return '#D7F7E7';
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    setTimeout(async () => {
      await logout();
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Header Card */}
        <Card style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(user?.name || 'User')}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@email.com'}</Text>
          <View style={styles.modeChipContainer}>
            <Chip
              label={`Mode: ${aiMode}`}
              backgroundColor={getModeColor(aiMode)}
            />
          </View>
        </Card>

        {/* About You Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About You</Text>
          <Card>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Life Stage</Text>
              <View style={styles.inputRight}>
                <Text style={styles.inputValue}>{lifeStage}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Job Type</Text>
              <View style={styles.inputRight}>
                <Text style={styles.inputValue}>{jobType}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </View>
            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Dependents</Text>
              <View style={styles.stepperContainer}>
                <TouchableOpacity 
                  style={styles.stepperButton}
                  onPress={() => setDependents(Math.max(0, dependents - 1))}
                >
                  <Text style={styles.stepperButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{dependents}</Text>
                <TouchableOpacity 
                  style={styles.stepperButton}
                  onPress={() => setDependents(dependents + 1)}
                >
                  <Text style={styles.stepperButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Monthly Income</Text>
              <TextInput
                style={styles.textInput}
                value={`₹ ${monthlyIncome}`}
                onChangeText={(text) => setMonthlyIncome(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Salary Credit Date</Text>
              <TextInput
                style={styles.textInput}
                value={salaryCreditDate}
                onChangeText={setSalaryCreditDate}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </Card>
        </View>

        {/* Connections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connections</Text>
          <Card>
            {connections.map((item, index) => (
              <React.Fragment key={item.name}>
                <View style={styles.connectionRow}>
                  <View style={styles.connectionLeft}>
                    <Text style={styles.connectionIcon}>{item.icon}</Text>
                    <Text style={styles.connectionName}>{item.name}</Text>
                  </View>
                  <View style={styles.connectionRight}>
                    <View style={[
                      styles.statusPill,
                      item.connected ? styles.statusConnected : styles.statusNotConnected
                    ]}>
                      <Text style={[
                        styles.statusText,
                        item.connected ? styles.statusTextConnected : styles.statusTextNotConnected
                      ]}>
                        {item.connected ? 'Connected' : 'Connect'}
                      </Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                </View>
                {index < connections.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </Card>
          <Text style={styles.infoText}>
            We use Account Aggregator (AA) for secure, read-only access.
          </Text>
        </View>

        {/* AI Mode Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Mode Settings</Text>
          <Card>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Current Mode</Text>
              <View style={styles.modeSelector}>
                <TouchableOpacity 
                  style={styles.modePill}
                  onPress={() => setAiMode(aiMode === 'Normal' ? 'Crisis' : aiMode === 'Crisis' ? 'Growth' : 'Normal')}
                >
                  <Text style={[styles.modePillText, styles.modePillTextActive]}>{aiMode}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.modeHintText}>
              Tap to cycle modes. "Crisis" locks non-essentials. "Growth" pushes investments.
            </Text>
          </Card>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Card>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Debt & EMI Alerts</Text>
              <Switch
                value={notifDebtEMI}
                onValueChange={setNotifDebtEMI}
                trackColor={{ false: '#767577', true: colors.buttonGreen }}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Overspending Nudges</Text>
              <Switch
                value={notifOverspending}
                onValueChange={setNotifOverspending}
                trackColor={{ false: '#767577', true: colors.buttonGreen }}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Daily Coach Tips</Text>
              <Switch
                value={notifDailyTips}
                onValueChange={setNotifDailyTips}
                trackColor={{ false: '#767577', true: colors.buttonGreen }}
              />
            </View>
          </Card>
        </View>

        {/* Privacy & Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          <Card>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Allow Anonymous Data Usage</Text>
              <Switch
                value={allowAnonymousData}
                onValueChange={setAllowAnonymousData}
                trackColor={{ false: '#767577', true: colors.buttonGreen }}
              />
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.inputRow}>
              <Text style={styles.privacyLabel}>Export My Data</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.inputRow}>
              <Text style={styles.dangerLabel}>Delete Account</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </Card>
          <Text style={styles.privacyInfoText}>
            We never sell your personal data. Read our Privacy Policy.
          </Text>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <LogOut size={32} color={colors.crisis} />
            </View>
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out?{'\n'}
              You'll need to sign in again to access your data.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalLogoutButton}
                onPress={confirmLogout}
              >
                <Text style={styles.modalLogoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  headerCard: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.buttonGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  modeChipContainer: {
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.textDark,
    flex: 1,
  },
  inputRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputValue: {
    fontSize: 16,
    color: colors.textLight,
    marginRight: spacing.sm,
  },
  chevron: {
    fontSize: 24,
    color: colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperButtonText: {
    fontSize: 20,
    color: colors.textDark,
    fontWeight: '600',
  },
  stepperValue: {
    fontSize: 16,
    color: colors.textDark,
    marginHorizontal: spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },
  textInput: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'right',
    minWidth: 100,
    paddingVertical: 0,
  },
  connectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  connectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  connectionIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  connectionName: {
    fontSize: 16,
    color: colors.textDark,
  },
  connectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  statusConnected: {
    backgroundColor: '#D7F7E7',
  },
  statusNotConnected: {
    backgroundColor: '#F0F0F0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextConnected: {
    color: colors.buttonGreen,
  },
  statusTextNotConnected: {
    color: colors.textLight,
  },
  infoText: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
    marginTop: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  toggleLabel: {
    fontSize: 16,
    color: colors.textDark,
    flex: 1,
    marginRight: spacing.md,
  },
  modeSelector: {
    gap: spacing.sm,
  },
  modePill: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  modePillText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  modePillTextActive: {
    color: colors.textDark,
  },
  modeHintText: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  privacyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  privacyLabel: {
    fontSize: 16,
    color: colors.textDark,
  },
  dangerLabel: {
    fontSize: 16,
    color: colors.crisis,
  },
  privacyInfoText: {
    fontSize: 12,
    color: '#777777',
    lineHeight: 18,
    marginTop: spacing.md,
  },
  logoutContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  logoutButton: {
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  bottomPadding: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.xl,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  modalMessage: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  modalLogoutButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.crisis,
    alignItems: 'center',
  },
  modalLogoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});