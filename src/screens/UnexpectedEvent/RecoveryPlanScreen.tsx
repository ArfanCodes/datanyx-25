import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateRecoveryPlan } from '../../utils/recoveryEngine';
import { RecoveryPlan } from '../../types/unexpectedEvents';

interface RecoveryPlanScreenProps {
    navigation: any;
    route: any;
}

export const RecoveryPlanScreen: React.FC<RecoveryPlanScreenProps> = ({
    navigation,
    route,
}) => {
    const { eventType, moneyLost, remainingBalance, reason, isRecurring } = route.params;
    const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);
    const [checkedToday, setCheckedToday] = useState<boolean[]>([]);
    const [checkedWeek, setCheckedWeek] = useState<boolean[]>([]);

    useEffect(() => {
        loadProfileAndGeneratePlan();
    }, []);

    const loadProfileAndGeneratePlan = async () => {
        try {
            const profileData = await AsyncStorage.getItem('@peso_profile_data');
            if (profileData) {
                const profile = JSON.parse(profileData);
                const monthlyIncome = profile.monthlySalary || 50000;
                const fixedExpenses = profile.fixedExpenses?.reduce(
                    (sum: number, exp: any) => sum + exp.amount,
                    0
                ) || 10000;
                const variableExpenses = 5000; // Estimate
                const currentStabilityScore = 75; // Default

                const plan = generateRecoveryPlan(
                    moneyLost,
                    remainingBalance,
                    monthlyIncome,
                    fixedExpenses,
                    variableExpenses,
                    currentStabilityScore
                );

                setRecoveryPlan(plan);
                setCheckedToday(new Array(plan.todayActions.length).fill(false));
                setCheckedWeek(new Array(plan.weekActions.length).fill(false));

                // Save event to AsyncStorage
                await saveUnexpectedEvent();
            }
        } catch (error) {
            console.error('Failed to generate recovery plan:', error);
        }
    };

    const saveUnexpectedEvent = async () => {
        try {
            const event = {
                id: Date.now().toString(),
                eventType,
                moneyLost,
                remainingBalance,
                reason,
                isRecurring,
                createdAt: new Date().toISOString(),
            };

            const existingEvents = await AsyncStorage.getItem('@peso_unexpected_events');
            const events = existingEvents ? JSON.parse(existingEvents) : [];
            events.push(event);

            await AsyncStorage.setItem('@peso_unexpected_events', JSON.stringify(events));
            await AsyncStorage.setItem('@peso_recovery_plan_active', 'true');
        } catch (error) {
            console.error('Failed to save unexpected event:', error);
        }
    };

    const toggleTodayAction = (index: number) => {
        const updated = [...checkedToday];
        updated[index] = !updated[index];
        setCheckedToday(updated);
    };

    const toggleWeekAction = (index: number) => {
        const updated = [...checkedWeek];
        updated[index] = !updated[index];
        setCheckedWeek(updated);
    };

    if (!recoveryPlan) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Generating recovery plan...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Main')}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Recovery Plan</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Alert Banner */}
                <View style={styles.alertBanner}>
                    <Text style={styles.alertIcon}>⚠️</Text>
                    <View style={styles.alertTextContainer}>
                        <Text style={styles.alertTitle}>Recovery Plan Active</Text>
                        <Text style={styles.alertText}>
                            Follow these steps to restore your financial stability
                        </Text>
                    </View>
                </View>

                {/* Updated Metrics */}
                <View style={styles.metricsCard}>
                    <Text style={styles.sectionTitle}>Updated Financial Status</Text>
                    <View style={styles.metricsGrid}>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Runway</Text>
                            <Text style={styles.metricValue}>{recoveryPlan.updatedRunway} days</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Stability Score</Text>
                            <Text style={styles.metricValue}>{recoveryPlan.updatedStabilityScore}/100</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Safe Spend/Day</Text>
                            <Text style={styles.metricValue}>₹{recoveryPlan.safeSpendLimit}</Text>
                        </View>
                    </View>
                </View>

                {/* A. What To Do Today */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>A. What To Do Today</Text>
                    <View style={styles.actionsList}>
                        {recoveryPlan.todayActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.actionItem}
                                onPress={() => toggleTodayAction(index)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        checkedToday[index] && styles.checkboxChecked,
                                    ]}
                                >
                                    {checkedToday[index] && (
                                        <CheckCircle2 size={20} color="#32D483" strokeWidth={2.5} />
                                    )}
                                </View>
                                <Text
                                    style={[
                                        styles.actionText,
                                        checkedToday[index] && styles.actionTextChecked,
                                    ]}
                                >
                                    {action}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* B. What To Do This Week */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>B. What To Do This Week</Text>
                    <View style={styles.actionsList}>
                        {recoveryPlan.weekActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.actionItem}
                                onPress={() => toggleWeekAction(index)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        checkedWeek[index] && styles.checkboxChecked,
                                    ]}
                                >
                                    {checkedWeek[index] && (
                                        <CheckCircle2 size={20} color="#32D483" strokeWidth={2.5} />
                                    )}
                                </View>
                                <Text
                                    style={[
                                        styles.actionText,
                                        checkedWeek[index] && styles.actionTextChecked,
                                    ]}
                                >
                                    {action}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 30-Day Survival Plan */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>30-Day Survival Plan</Text>
                    <View style={styles.survivalList}>
                        {recoveryPlan.survivalPlan.map((step, index) => (
                            <View key={index} style={styles.survivalItem}>
                                <View style={styles.survivalBullet} />
                                <Text style={styles.survivalText}>{step}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* C. How to Recover the Lost Money */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>C. How to Recover the Lost Money</Text>
                    <View style={styles.recoveryStepsList}>
                        {recoveryPlan.recoverySteps.map((step, index) => (
                            <View key={index} style={styles.recoveryStepItem}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.recoveryStepText}>{step}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* D. Stability Return Prediction */}
                <View style={styles.predictionCard}>
                    <Text style={styles.sectionTitle}>D. Stability Return Prediction</Text>
                    <View style={styles.predictionContent}>
                        <Text style={styles.predictionIcon}>📈</Text>
                        <Text style={styles.predictionText}>
                            Your financial stability will return to normal in{' '}
                            <Text style={styles.predictionDays}>
                                {recoveryPlan.stabilityReturnDays} days
                            </Text>{' '}
                            if you follow the plan.
                        </Text>
                    </View>

                    {/* Timeline Indicator */}
                    <View style={styles.timeline}>
                        <View style={styles.timelineStart}>
                            <Text style={styles.timelineLabel}>Today</Text>
                        </View>
                        <View style={styles.timelineBar}>
                            <View style={styles.timelineProgress} />
                        </View>
                        <View style={styles.timelineEnd}>
                            <Text style={styles.timelineLabel}>
                                Day {recoveryPlan.stabilityReturnDays}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Done Button */}
                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => navigation.navigate('Main')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.doneButtonText}>Got It!</Text>
                </TouchableOpacity>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    placeholder: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#6B6B6B',
    },

    // Alert Banner
    alertBanner: {
        flexDirection: 'row',
        backgroundColor: '#FFF4E5',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#FFB84D',
    },
    alertIcon: {
        fontSize: 28,
        marginRight: 14,
    },
    alertTextContainer: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    alertText: {
        fontSize: 14,
        color: '#6B6B6B',
        lineHeight: 20,
    },

    // Metrics Card
    metricsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,
    },
    metricsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    metricItem: {
        flex: 1,
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B6B6B',
        marginBottom: 6,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },

    // Section Card
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
    },

    // Actions List
    actionsList: {
        gap: 12,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        backgroundColor: '#F4F4F4',
        borderRadius: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#32D483',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#E8F8F0',
    },
    actionText: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        lineHeight: 21,
    },
    actionTextChecked: {
        textDecorationLine: 'line-through',
        color: '#6B6B6B',
    },

    // Recovery Steps
    recoveryStepsList: {
        gap: 16,
    },
    recoveryStepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#32D483',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    recoveryStepText: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        lineHeight: 21,
    },

    // Prediction Card
    predictionCard: {
        backgroundColor: '#E8F8F0',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#32D483',
    },
    predictionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 20,
    },
    predictionIcon: {
        fontSize: 32,
    },
    predictionText: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        lineHeight: 21,
    },
    predictionDays: {
        fontWeight: '700',
        color: '#32D483',
    },

    // Timeline
    timeline: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    timelineStart: {
        alignItems: 'center',
    },
    timelineEnd: {
        alignItems: 'center',
    },
    timelineLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B6B6B',
    },
    timelineBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        overflow: 'hidden',
    },
    timelineProgress: {
        width: '30%',
        height: '100%',
        backgroundColor: '#32D483',
        borderRadius: 3,
    },

    // Done Button
    doneButton: {
        backgroundColor: '#32D483',
        borderRadius: 14,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#32D483',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    doneButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Survival Plan
    survivalList: {
        gap: 16,
    },
    survivalItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    survivalBullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#32D483',
        marginTop: 6,
    },
    survivalText: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        lineHeight: 21,
    },

    bottomPadding: {
        height: 40,
    },
});
