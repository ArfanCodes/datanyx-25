import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, ShoppingBag, Utensils, CreditCard, Home as HomeIcon, Zap, DollarSign } from 'lucide-react-native';
import { Card } from '../../components/Card';
import { CircularProgress } from '../../components/CircularProgress';
import { colors } from '../../utils/colors';

// Category colors (soft pastels)
const CATEGORY_COLORS = {
  Food: '#FFE4A8',
  Transport: '#CCEFFF',
  Bills: '#EDE9FF',
  Shopping: '#FFD8E8',
  Subscriptions: '#E8F5E9',
  Others: '#F5F5F5',
};

export const SpendingScreen = () => {
  // Mock data - replace with actual data from API/store
  const [monthlyBudget, setMonthlyBudget] = useState(25000); // Set to 0 to test fallback state

  const monthlyData = {
    totalSpent: 18400,
    incomeReceived: 65000,
    remainingBalance: 19800,
  };

  const categoryData = [
    { name: 'Food', amount: 12500, percentage: 28, icon: Utensils },
    { name: 'Transport', amount: 8200, percentage: 18, icon: TrendingUp },
    { name: 'Bills', amount: 15000, percentage: 33, icon: CreditCard },
    { name: 'Shopping', amount: 6500, percentage: 14, icon: ShoppingBag },
    { name: 'Subscriptions', amount: 2000, percentage: 4, icon: Zap },
    { name: 'Others', amount: 1000, percentage: 2, icon: DollarSign },
  ];

  const budgetSplit = {
    essentials: { planned: 50, actual: 58 },
    wants: { planned: 30, actual: 42 },
    safety: { planned: 20, actual: 0 },
  };

  const incomeSourcesData = [
    { name: 'Salary', amount: 50000, reliability: 100, trend: 'stable' },
    { name: 'Freelancing', amount: 12000, reliability: 75, trend: 'up' },
    { name: 'Other', amount: 3000, reliability: 50, trend: 'down' },
  ];

  const spendingPatterns = [
    'Weekend spending 40% higher',
    'Peak orders at night',
    'Delivery apps used 6x this week',
  ];

  const transactions = [
    { id: '1', merchant: 'Swiggy', category: 'Food', amount: 450, time: '2 hours ago' },
    { id: '2', merchant: 'Uber', category: 'Transport', amount: 280, time: '5 hours ago' },
    { id: '3', merchant: 'Amazon', category: 'Shopping', amount: 1200, time: 'Yesterday' },
    { id: '4', merchant: 'Netflix', category: 'Subscriptions', amount: 649, time: '2 days ago' },
    { id: '5', merchant: 'Electricity Bill', category: 'Bills', amount: 3500, time: '3 days ago' },
  ];

  // Calculate percentage for circular progress
  const percentageUsed = monthlyBudget > 0 ? (monthlyData.totalSpent / monthlyBudget) * 100 : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Spending Overview</Text>
          <Text style={styles.headerSubtitle}>Track where your money went this month.</Text>
        </View>

        {/* 2. Circular Spending Progress */}
        <Card style={styles.progressCard}>
          <Text style={styles.progressTitle}>Spending Overview</Text>

          {monthlyBudget > 0 ? (
            <View style={styles.progressContent}>
              <CircularProgress
                percentage={percentageUsed}
                spent={monthlyData.totalSpent}
                budget={monthlyBudget}
                size={160}
              />
            </View>
          ) : (
            <View style={styles.noBudgetContainer}>
              <Text style={styles.noBudgetText}>
                Set a monthly budget to track your spending.
              </Text>
              <TouchableOpacity
                style={styles.setBudgetButton}
                activeOpacity={0.8}
              >
                <Text style={styles.setBudgetButtonText}>Set Budget</Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* 3. Monthly Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={[styles.summaryValue, { color: '#E53935' }]}>₹{monthlyData.totalSpent.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryValue, { color: colors.buttonGreen }]}>₹{monthlyData.incomeReceived.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Remaining</Text>
              <Text style={styles.summaryValue}>₹{monthlyData.remainingBalance.toLocaleString()}</Text>
            </View>
          </View>
        </Card>

        {/* 3. Category Breakdown */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
        </View>
        <View style={styles.categoryGrid}>
          {categoryData.map((category) => {
            const IconComponent = category.icon;
            return (
              <View
                key={category.name}
                style={[
                  styles.categoryCard,
                  { backgroundColor: CATEGORY_COLORS[category.name as keyof typeof CATEGORY_COLORS] }
                ]}
              >
                <IconComponent size={24} color={colors.textDark} strokeWidth={2} />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryAmount}>₹{category.amount.toLocaleString()}</Text>
                <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
              </View>
            );
          })}
        </View>

        {/* 4. Budget Split vs Reality */}
        <Card style={styles.budgetCard}>
          <Text style={styles.budgetTitle}>Budget Split vs Reality</Text>

          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Essentials</Text>
            <View style={styles.budgetBarContainer}>
              <View style={[styles.budgetBar, { width: `${budgetSplit.essentials.actual}%`, backgroundColor: colors.accentBlue }]} />
            </View>
            <Text style={styles.budgetValue}>{budgetSplit.essentials.actual}%</Text>
          </View>

          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Wants</Text>
            <View style={styles.budgetBarContainer}>
              <View style={[styles.budgetBar, { width: `${budgetSplit.wants.actual}%`, backgroundColor: colors.accentPink }]} />
            </View>
            <Text style={styles.budgetValue}>{budgetSplit.wants.actual}%</Text>
          </View>

          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Safety</Text>
            <View style={styles.budgetBarContainer}>
              <View style={[styles.budgetBar, { width: `${budgetSplit.safety.actual}%`, backgroundColor: colors.accentYellow }]} />
            </View>
            <Text style={styles.budgetValue}>{budgetSplit.safety.actual}%</Text>
          </View>

          <Text style={styles.budgetInsight}>
            You spent {budgetSplit.wants.actual - budgetSplit.wants.planned}% more on Wants this month.
          </Text>
        </Card>

        {/* 5. Multi-Income Tracker */}
        <Card style={styles.incomeCard}>
          <Text style={styles.incomeTitle}>Income Sources</Text>
          {incomeSourcesData.map((source, index) => (
            <View key={index} style={styles.incomeRow}>
              <View style={styles.incomeInfo}>
                <Text style={styles.incomeName}>{source.name}</Text>
                <Text style={styles.incomeReliability}>Reliability: {source.reliability}%</Text>
              </View>
              <View style={styles.incomeRight}>
                <Text style={styles.incomeAmount}>₹{source.amount.toLocaleString()}</Text>
                {source.trend === 'up' && <TrendingUp size={16} color={colors.buttonGreen} strokeWidth={2.5} />}
                {source.trend === 'down' && <TrendingDown size={16} color="#E53935" strokeWidth={2.5} />}
                {source.trend === 'stable' && <View style={styles.stableDot} />}
              </View>
            </View>
          ))}
        </Card>

        {/* 6. Spending Patterns */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spending Patterns</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.patternsContainer}
        >
          {spendingPatterns.map((pattern, index) => (
            <View
              key={index}
              style={[
                styles.patternChip,
                { backgroundColor: [colors.accentYellow, colors.accentPink, colors.accentBlue][index % 3] }
              ]}
            >
              <Text style={styles.patternText}>{pattern}</Text>
            </View>
          ))}
        </ScrollView>

        {/* 7. Transaction Timeline */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
        <View style={styles.transactionList}>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <Text style={styles.transactionMerchant}>{transaction.merchant}</Text>
                <Text style={styles.transactionCategory}>{transaction.category} • {transaction.time}</Text>
              </View>
              <Text style={styles.transactionAmount}>₹{transaction.amount}</Text>
            </View>
          ))}
        </View>

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
  progressCard: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  progressContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  noBudgetContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noBudgetText: {
    fontSize: 15,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  setBudgetButton: {
    backgroundColor: colors.buttonGreen,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  setBudgetButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryCard: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'flex-start',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: 8,
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 4,
  },
  categoryPercentage: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  budgetCard: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  budgetLabel: {
    fontSize: 14,
    color: colors.textDark,
    width: 80,
  },
  budgetBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  budgetBar: {
    height: '100%',
    borderRadius: 4,
  },
  budgetValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    width: 40,
    textAlign: 'right',
  },
  budgetInsight: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  incomeCard: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  incomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  incomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  incomeInfo: {
    flex: 1,
  },
  incomeName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  incomeReliability: {
    fontSize: 13,
    color: '#888888',
  },
  incomeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  stableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#888888',
  },
  patternsContainer: {
    paddingRight: 24,
    marginBottom: 24,
  },
  patternChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
  },
  patternText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textDark,
  },
  transactionList: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 13,
    color: '#888888',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
});

