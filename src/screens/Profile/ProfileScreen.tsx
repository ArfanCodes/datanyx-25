import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { colors } from '../../utils/colors';
import { spacing } from '../../theme/spacing';
import { useAuthStore } from '../../store/authStore';

type AIMode = 'Crisis' | 'Normal' | 'Growth';
type LifeStage = 'Student' | 'Early Career' | 'Mid Career' | 'Family' | 'Other';
type JobType = 'Salaried' | 'Freelancer' | 'Gig' | 'Self-employed' | 'Other';

interface ConnectionStatus {
  name: string;
  icon: string;
  connected: boolean;
}

export const ProfileScreen = () => {
  const { logout } = useAuthStore();
  
  // User data state
  const [userName] = useState('Arfan Khan');
  const [userEmail] = useState('arfan@example.com');
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

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // Navigation will be handled automatically by AppNavigator
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* User Header Card */}
      <Card style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
          </View>
        </View>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
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
          {/* Life Stage */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Life Stage</Text>
            <View style={styles.inputRight}>
              <Text style={styles.inputValue}>{lifeStage}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Job Type */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Job Type</Text>
            <View style={styles.inputRight}>
              <Text style={styles.inputValue}>{jobType}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Dependents */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Dependents</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => setDependents(Math.max(0, dependents - 1))}
              >
                <Text style={styles.stepperButtonText}>−</Text>
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

          {/* Monthly Income */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Monthly Income</Text>
            <TextInput
              style={styles.textInput}
              value={monthlyIncome}
              onChangeText={setMonthlyIncome}
              keyboardType="numeric"
              placeholder="50000"
            />
          </View>

          <View style={styles.divider} />

          {/* Salary Credit Date */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Salary Credit Date</Text>
            <TextInput
              style={styles.textInput}
              value={salaryCreditDate}
              onChangeText={setSalaryCreditDate}
              keyboardType="numeric"
              placeholder="1"
            />
          </View>
        </Card>
      </View>

      {/* Connected Accounts & Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Accounts & Data</Text>
        <Card>
          {connections.map((connection, index) => (
            <View key={connection.name}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.connectionRow}>
                <View style={styles.connectionLeft}>
                  <Text style={styles.connectionIcon}>{connection.icon}</Text>
                  <Text style={styles.connectionName}>{connection.name}</Text>
                </View>
                <View style={styles.connectionRight}>
                  <View style={[
                    styles.statusPill,
                    connection.connected ? styles.statusConnected : styles.statusNotConnected
                  ]}>
                    <Text style={[
                      styles.statusText,
                      connection.connected ? styles.statusTextConnected : styles.statusTextNotConnected
                    ]}>
                      {connection.connected ? 'Connected' : 'Not connected'}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </View>
            </View>
          ))}

          <Text style={styles.infoText}>
            We only read transaction messages and approved connections to understand your money patterns.
          </Text>
        </Card>
      </View>

      {/* Notifications & Coach */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications & Coach</Text>
        <Card>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Alerts about debt & EMIs</Text>
            <Switch
              value={notifDebtEMI}
              onValueChange={setNotifDebtEMI}
              trackColor={{ false: '#D0D0D0', true: colors.buttonGreen }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Alerts about overspending / leaks</Text>
            <Switch
              value={notifOverspending}
              onValueChange={setNotifOverspending}
              trackColor={{ false: '#D0D0D0', true: colors.buttonGreen }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Daily tips from Coach</Text>
            <Switch
              value={notifDailyTips}
              onValueChange={setNotifDailyTips}
              trackColor={{ false: '#D0D0D0', true: colors.buttonGreen }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Weekly summary report</Text>
            <Switch
              value={notifWeeklySummary}
              onValueChange={setNotifWeeklySummary}
              trackColor={{ false: '#D0D0D0', true: colors.buttonGreen }}
              thumbColor={colors.white}
            />
          </View>
        </Card>
      </View>

      {/* AI Mode Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are things right now?</Text>
        <Card>
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modePill,
                aiMode === 'Crisis' && { backgroundColor: colors.accentPink }
              ]}
              onPress={() => setAiMode('Crisis')}
            >
              <Text style={[
                styles.modePillText,
                aiMode === 'Crisis' && styles.modePillTextActive
              ]}>
                I'm in Crisis
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modePill,
                aiMode === 'Normal' && { backgroundColor: colors.accentBlue }
              ]}
              onPress={() => setAiMode('Normal')}
            >
              <Text style={[
                styles.modePillText,
                aiMode === 'Normal' && styles.modePillTextActive
              ]}>
                Things are Normal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modePill,
                aiMode === 'Growth' && { backgroundColor: '#D7F7E7' }
              ]}
              onPress={() => setAiMode('Growth')}
            >
              <Text style={[
                styles.modePillText,
                aiMode === 'Growth' && styles.modePillTextActive
              ]}>
                I want to Grow
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modeHintText}>
            This helps the app focus on the right advice for you.
          </Text>
        </Card>
      </View>

      {/* Privacy & Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Data</Text>
        <Card>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Allow anonymised data to improve recommendations</Text>
            <Switch
              value={allowAnonymousData}
              onValueChange={setAllowAnonymousData}
              trackColor={{ false: '#D0D0D0', true: colors.buttonGreen }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.privacyRow}>
            <Text style={styles.privacyLabel}>View what data is stored</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.privacyRow}>
            <Text style={styles.dangerLabel}>Clear personal data</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <Text style={styles.privacyInfoText}>
            You're always in control. You can disconnect data sources or clear data anytime.
          </Text>
        </Card>
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
});