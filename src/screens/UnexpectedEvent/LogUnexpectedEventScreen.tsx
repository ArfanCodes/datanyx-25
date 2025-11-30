import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { UnexpectedEventType, EVENT_TYPE_LABELS } from '../../types/unexpectedEvents';

interface LogUnexpectedEventScreenProps {
    navigation: any;
}

export const LogUnexpectedEventScreen: React.FC<LogUnexpectedEventScreenProps> = ({
    navigation,
}) => {
    const [eventType, setEventType] = useState<UnexpectedEventType>('SALARY_DELAY');
    const [moneyLost, setMoneyLost] = useState('');
    const [remainingBalance, setRemainingBalance] = useState('');
    const [reason, setReason] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [showEventTypePicker, setShowEventTypePicker] = useState(false);

    const handleGenerateRecoveryPlan = () => {
        // Validation
        if (!moneyLost || parseInt(moneyLost) <= 0) {
            Alert.alert('Invalid Input', 'Please enter the money lost amount.');
            return;
        }

        if (!remainingBalance || parseInt(remainingBalance) < 0) {
            Alert.alert('Invalid Input', 'Please enter your remaining balance.');
            return;
        }

        if (!reason.trim()) {
            Alert.alert('Invalid Input', 'Please explain what happened.');
            return;
        }

        // Navigate to recovery plan screen with data
        navigation.navigate('RecoveryPlan', {
            eventType,
            moneyLost: parseInt(moneyLost),
            remainingBalance: parseInt(remainingBalance),
            reason,
            isRecurring,
        });
    };

    const eventTypes: UnexpectedEventType[] = [
        'SALARY_DELAY',
        'SALARY_CUT',
        'MEDICAL',
        'EMERGENCY_TRAVEL',
        'CAR_BIKE_REPAIR',
        'INCOME_NOT_RECEIVED',
        'FAMILY_EMERGENCY',
        'OTHERS',
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Log Unexpected Event</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Event Type */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Event Type</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setShowEventTypePicker(!showEventTypePicker)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.dropdownText}>{EVENT_TYPE_LABELS[eventType]}</Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                    </TouchableOpacity>

                    {showEventTypePicker && (
                        <View style={styles.pickerContainer}>
                            {eventTypes.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.pickerItem,
                                        eventType === type && styles.pickerItemSelected,
                                    ]}
                                    onPress={() => {
                                        setEventType(type);
                                        setShowEventTypePicker(false);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.pickerItemText,
                                            eventType === type && styles.pickerItemTextSelected,
                                        ]}
                                    >
                                        {EVENT_TYPE_LABELS[type]}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Money Lost */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Money Lost</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.currencyPrefix}>₹</Text>
                        <TextInput
                            style={styles.input}
                            value={moneyLost}
                            onChangeText={(value) => {
                                const cleaned = value.replace(/[^0-9]/g, '');
                                setMoneyLost(cleaned);
                            }}
                            keyboardType="numeric"
                            placeholder="Enter amount"
                            placeholderTextColor="#9A9A9A"
                        />
                    </View>
                </View>

                {/* Remaining Balance */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Remaining Balance</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.currencyPrefix}>₹</Text>
                        <TextInput
                            style={styles.input}
                            value={remainingBalance}
                            onChangeText={(value) => {
                                const cleaned = value.replace(/[^0-9]/g, '');
                                setRemainingBalance(cleaned);
                            }}
                            keyboardType="numeric"
                            placeholder="Enter amount"
                            placeholderTextColor="#9A9A9A"
                        />
                    </View>
                </View>

                {/* Reason */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Why did this happen?</Text>
                    <TextInput
                        style={styles.textArea}
                        value={reason}
                        onChangeText={setReason}
                        placeholder="Explain the situation..."
                        placeholderTextColor="#9A9A9A"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                {/* Recurring Toggle */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Is this recurring?</Text>
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                !isRecurring && styles.toggleButtonActive,
                            ]}
                            onPress={() => setIsRecurring(false)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.toggleButtonText,
                                    !isRecurring && styles.toggleButtonTextActive,
                                ]}
                            >
                                No
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                isRecurring && styles.toggleButtonActive,
                            ]}
                            onPress={() => setIsRecurring(true)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.toggleButtonText,
                                    isRecurring && styles.toggleButtonTextActive,
                                ]}
                            >
                                Yes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleGenerateRecoveryPlan}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>Generate Recovery Plan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>

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
    fieldContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        paddingHorizontal: 18,
        height: 56,
    },
    dropdownText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    dropdownArrow: {
        fontSize: 12,
        color: '#6B6B6B',
    },
    pickerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        overflow: 'hidden',
    },
    pickerItem: {
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F4F4F4',
    },
    pickerItemSelected: {
        backgroundColor: '#E8F8F0',
    },
    pickerItemText: {
        fontSize: 15,
        color: '#1A1A1A',
    },
    pickerItemTextSelected: {
        fontWeight: '600',
        color: '#32D483',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        paddingHorizontal: 18,
        height: 56,
    },
    currencyPrefix: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    textArea: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        paddingHorizontal: 18,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1A1A1A',
        minHeight: 100,
    },
    toggleContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: '#F4F4F4',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    toggleButtonActive: {
        backgroundColor: '#E8F8F0',
        borderColor: '#32D483',
    },
    toggleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B6B6B',
    },
    toggleButtonTextActive: {
        color: '#32D483',
    },
    buttonsContainer: {
        marginTop: 16,
        gap: 12,
    },
    primaryButton: {
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
    primaryButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 18,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E8E8E8',
    },
    secondaryButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#6B6B6B',
    },
    bottomPadding: {
        height: 40,
    },
});
