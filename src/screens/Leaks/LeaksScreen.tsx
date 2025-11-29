import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle } from 'lucide-react-native';
import { Card } from '../../components/Card';
import { colors } from '../../utils/colors';

type LeakStatus = 'Keep' | 'Review' | 'Cancel';

interface GhostExpense {
  id: string;
  merchant: string;
  amount: number;
  frequency: string;
  tag: string;
  status: LeakStatus;
}

interface LeakSource {
  id: string;
  category: string;
  amount: number;
  reason: string;
  backgroundColor: string;
}

export const LeaksScreen = () => {
  // Mock data - replace with actual data from API/store
  const totalRecurring = 2847;

  const ghostExpenses: GhostExpense[] = [
    { id: '1', merchant: 'Netflix', amount: 649, frequency: 'month', tag: 'Subscription', status: 'Keep' },
    { id: '2', merchant: 'Spotify', amount: 119, frequency: 'month', tag: 'Subscription', status: 'Keep' },
    { id: '3', merchant: 'Amazon Prime', amount: 1499, frequency: 'year', tag: 'Auto-renewal', status: 'Review' },
    { id: '4', merchant: 'iCloud Storage', amount: 75, frequency: 'month', tag: 'Subscription', status: 'Review' },
    { id: '5', merchant: 'Gym Membership', amount: 500, frequency: 'month', tag: 'Tiny but frequent', status: 'Cancel' },
  ];

  const leakSources: LeakSource[] = [
    { 
      id: '1', 
      category: 'Food Delivery', 
      amount: 8500, 
      reason: 'Orders increased 40% vs last month',
      backgroundColor: colors.accentYellow 
    },
    { 
      id: '2', 
      category: 'Online Shopping', 
      amount: 6200, 
      reason: 'Average order size going up',
      backgroundColor: colors.accentPink 
    },
    { 
      id: '3', 
      category: 'Ride Apps', 
      amount: 3800, 
      reason: 'Spends mostly on weekends',
      backgroundColor: colors.accentBlue 
    },
    { 
      id: '4', 
      category: 'Coffee Shops', 
      amount: 2400, 
      reason: 'Daily small purchases adding up',
      backgroundColor: colors.accentYellow 
    },
    { 
      id: '5', 
      category: 'Impulse Buys', 
      amount: 1800, 
      reason: 'Late night online orders',
      backgroundColor: colors.accentPink 
    },
  ];

  const debtData = {
    emiToIncomeRatio: 32,
    creditUsage: 65,
    stressLevel: 45, // 0-100 scale
  };

  const riskAlerts = [
    "You're on track to go negative by 24th",
    "Subscriptions jumped 30% this month",
    "BNPL bills stacking up next week",
    "Weekend spending pattern detected",
  ];

  const getStatusColor = (status: LeakStatus) => {
    switch (status) {
      case 'Keep': return colors.buttonGreen;
      case 'Review': return '#F9A825';
      case 'Cancel': return '#E53935';
      default: return colors.textDark;
    }
  };

  const getStressZone = (level: number) => {
    if (level < 33) return { zone: 'Low', color: colors.buttonGreen, message: 'Your debt level is manageable.' };
    if (level < 66) return { zone: 'Medium', color: '#F9A825', message: 'Debt stress is moderate — monitor closely.' };
    return { zone: 'High', color: '#E53935', message: 'Debt stress is high — reduce EMIs or spends.' };
  };

  const stressInfo = getStressZone(debtData.stressLevel);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Money Leaks</Text>
          <Text style={styles.headerSubtitle}>Silent drains, subscriptions, and debt stress.</Text>
        </View>

        {/* 2. Ghost Expense Detector */}
        <Card style={styles.ghostCard}>
          <Text style={styles.cardTitle}>Recurring & Hidden Payments</Text>
          <Text style={styles.recurringTotal}>
            You're spending ₹{totalRecurring.toLocaleString()}/month on recurring charges.
          </Text>

          <View style={styles.ghostList}>
            {ghostExpenses.map((expense) => (
              <TouchableOpacity 
                key={expense.id} 
                style={styles.ghostRow}
                activeOpacity={0.7}
              >
                <View style={styles.ghostLeft}>
                  <Text style={styles.ghostMerchant}>{expense.merchant}</Text>
                  <View style={styles.ghostMeta}>
                    <Text style={styles.ghostAmount}>₹{expense.amount} / {expense.frequency}</Text>
                    <Text style={styles.ghostTag}>{expense.tag}</Text>
                  </View>
                </View>
                <View style={[styles.statusPill, { borderColor: getStatusColor(expense.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(expense.status) }]}>
                    {expense.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 3. Top Leak Sources */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top 5 Leak Sources</Text>
        </View>
        <View style={styles.leaksList}>
          {leakSources.map((leak, index) => (
            <TouchableOpacity 
              key={leak.id} 
              style={[styles.leakRow, { backgroundColor: leak.backgroundColor }]}
              activeOpacity={0.7}
            >
              <View style={styles.leakContent}>
                <View style={styles.leakHeader}>
                  <Text style={styles.leakCategory}>{leak.category}</Text>
                  <Text style={styles.leakAmount}>₹{leak.amount.toLocaleString()}</Text>
                </View>
                <Text style={styles.leakReason}>{leak.reason}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. EMI & Debt Monitor */}
        <Card style={styles.debtCard}>
          <Text style={styles.cardTitle}>Debt & EMI Pressure</Text>
          
          <View style={styles.debtMetrics}>
            <View style={styles.debtMetricRow}>
              <Text style={styles.debtMetricLabel}>EMI to Income Ratio</Text>
              <Text style={styles.debtMetricValue}>{debtData.emiToIncomeRatio}%</Text>
            </View>
            <View style={styles.debtMetricRow}>
              <Text style={styles.debtMetricLabel}>Credit Usage</Text>
              <Text style={styles.debtMetricValue}>{debtData.creditUsage}%</Text>
            </View>
          </View>

          <View style={styles.stressMeterSection}>
            <Text style={styles.stressMeterLabel}>Debt Stress Meter</Text>
            <View style={styles.stressMeterBar}>
              {/* Low zone */}
              <View style={[styles.stressZone, { backgroundColor: '#C8E6C9', flex: 33 }]} />
              {/* Medium zone */}
              <View style={[styles.stressZone, { backgroundColor: '#FFF9C4', flex: 33 }]} />
              {/* High zone */}
              <View style={[styles.stressZone, { backgroundColor: '#FFCDD2', flex: 34 }]} />
              
              {/* Indicator dot */}
              <View 
                style={[
                  styles.stressIndicator, 
                  { 
                    left: `${debtData.stressLevel}%`,
                    backgroundColor: stressInfo.color 
                  }
                ]} 
              />
            </View>
            <Text style={styles.stressVerdict}>{stressInfo.message}</Text>
          </View>
        </Card>

        {/* 5. Risk Alerts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Risk Alerts</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.alertsContainer}
        >
          {riskAlerts.map((alert, index) => (
            <View 
              key={index} 
              style={[
                styles.alertChip,
                { backgroundColor: [colors.accentYellow, colors.accentPink, colors.accentBlue, colors.accentLavender][index % 4] }
              ]}
            >
              <AlertCircle size={16} color={colors.textDark} strokeWidth={2.5} />
              <Text style={styles.alertText}>{alert}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Bottom padding for TabBar */}
        <View style={{ height: 80 }} />
      </ScrollView>
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
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  ghostCard: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  recurringTotal: {
    fontSize: 14,
    color: '#E53935',
    marginBottom: 16,
    fontWeight: '500',
  },
  ghostList: {
    gap: 12,
  },
  ghostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
  },
  ghostLeft: {
    flex: 1,
  },
  ghostMerchant: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  ghostMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ghostAmount: {
    fontSize: 13,
    color: '#666666',
  },
  ghostTag: {
    fontSize: 12,
    color: '#888888',
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusPill: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  leaksList: {
    gap: 12,
    marginBottom: 24,
  },
  leakRow: {
    borderRadius: 16,
    padding: 16,
  },
  leakContent: {
    gap: 8,
  },
  leakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leakCategory: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  leakAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  leakReason: {
    fontSize: 14,
    color: '#666666',
  },
  debtCard: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  debtMetrics: {
    gap: 12,
    marginBottom: 20,
  },
  debtMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debtMetricLabel: {
    fontSize: 15,
    color: colors.textDark,
  },
  debtMetricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  stressMeterSection: {
    marginTop: 8,
  },
  stressMeterLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  stressMeterBar: {
    height: 24,
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  stressZone: {
    height: '100%',
  },
  stressIndicator: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
    marginLeft: -6,
  },
  stressVerdict: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  alertsContainer: {
    paddingRight: 24,
    gap: 12,
  },
  alertChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textDark,
  },
});

