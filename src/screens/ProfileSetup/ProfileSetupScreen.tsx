import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserCircle, ChevronDown, X } from 'lucide-react-native';
import { colors } from '../../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileSetupScreenProps {
  navigation?: any;
  onComplete?: () => void;
}

interface FixedExpense {
  name: string;
  amount: number;
}

const EMPLOYMENT_TYPES = [
  'Engineer',
  'Architect',
  'Software Developer',
  'Accountant',
  'Teacher',
  'Data Analyst',
  'Marketing Manager',
  'Civil Engineer',
  'Graphic Designer',
  'Consultant',
  'Nurse',
  'Lawyer',
  'HR Executive',
  'IT Consultant',
  'Researcher',
  'Civil Services Officer',
  'Entrepreneur',
  'Designer',
];

const PRIMARY_INCOME_SOURCES = [
  'Full-time Job',
  'Part-time Job',
  'Freelance',
  'Business',
  'Commission Based',
  'Irregular Income',
];

// Indian number formatting helper
const formatIndianNumber = (num: number): string => {
  if (!num || num === 0) return '';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Parse formatted number back to raw number
const parseFormattedNumber = (formatted: string): number => {
  const cleaned = formatted.replace(/,/g, '');
  return parseInt(cleaned, 10) || 0;
};

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ navigation, onComplete }) => {
  // Form state
  const [employmentType, setEmploymentType] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [monthlySalaryDisplay, setMonthlySalaryDisplay] = useState('');
  const [primaryIncomeSource, setPrimaryIncomeSource] = useState('');
  const [secondaryIncomeSource, setSecondaryIncomeSource] = useState('');
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [currentExpenseInput, setCurrentExpenseInput] = useState('');
  const [emiCount, setEmiCount] = useState('');
  const [investmentValue, setInvestmentValue] = useState('');
  const [investmentValueDisplay, setInvestmentValueDisplay] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [dependents, setDependents] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showEmploymentPicker, setShowEmploymentPicker] = useState(false);
  const [showIncomePicker, setShowIncomePicker] = useState(false);
  
  // Validation errors
  const [employmentTypeError, setEmploymentTypeError] = useState('');
  const [salaryError, setSalaryError] = useState('');
  const [primaryIncomeError, setPrimaryIncomeError] = useState('');
  const [fixedExpensesError, setFixedExpensesError] = useState('');
  const [emiError, setEmiError] = useState('');
  const [investmentError, setInvestmentError] = useState('');
  const [creditScoreError, setCreditScoreError] = useState('');
  const [dependentsError, setDependentsError] = useState('');
  const [expenseAmountErrors, setExpenseAmountErrors] = useState<{ [key: string]: string }>({});
  
  // Touched state for showing errors
  const [touched, setTouched] = useState({
    employmentType: false,
    salary: false,
    primaryIncome: false,
    fixedExpenses: false,
    emi: false,
    investment: false,
    creditScore: false,
    dependents: false,
  });

  // Format salary on blur
  const handleSalaryBlur = () => {
    setTouched({ ...touched, salary: true });
    if (monthlySalary) {
      const num = parseInt(monthlySalary, 10);
      setMonthlySalaryDisplay(formatIndianNumber(num));
    }
  };

  // Format investment on blur
  const handleInvestmentBlur = () => {
    setTouched({ ...touched, investment: true });
    if (investmentValue) {
      const num = parseInt(investmentValue, 10);
      setInvestmentValueDisplay(formatIndianNumber(num));
    }
  };

  // Numeric validation helper
  const validateNumericInput = (value: string, setter: (val: string) => void, errorSetter: (err: string) => void) => {
    if (value === '') {
      setter('');
      errorSetter('');
      return true;
    }
    
    const numericRegex = /^[0-9]+$/;
    if (numericRegex.test(value)) {
      setter(value);
      errorSetter('');
      return true;
    } else {
      errorSetter('Numbers only.');
      return false;
    }
  };

  // Credit score validation
  const validateCreditScore = (value: string) => {
    setTouched({ ...touched, creditScore: true });
    
    if (value === '') {
      setCreditScore('');
      setCreditScoreError('This field is required.');
      return;
    }
    
    const numericRegex = /^[0-9]+$/;
    if (!numericRegex.test(value)) {
      setCreditScoreError('Numbers only.');
      return;
    }
    
    const score = parseInt(value, 10);
    if (score < 300 || score > 850) {
      setCreditScoreError('Credit score must be between 300 and 850.');
    } else {
      setCreditScoreError('');
    }
    setCreditScore(value);
  };

  // Add fixed expense tag
  const addFixedExpense = () => {
    if (currentExpenseInput.trim() && !fixedExpenses.find(e => e.name === currentExpenseInput.trim())) {
      setFixedExpenses([...fixedExpenses, { name: currentExpenseInput.trim(), amount: 0 }]);
      setCurrentExpenseInput('');
      setFixedExpensesError('');
    }
  };

  // Remove fixed expense tag
  const removeFixedExpense = (expenseName: string) => {
    setFixedExpenses(fixedExpenses.filter(e => e.name !== expenseName));
    const newErrors = { ...expenseAmountErrors };
    delete newErrors[expenseName];
    setExpenseAmountErrors(newErrors);
  };

  // Update expense amount
  const updateExpenseAmount = (expenseName: string, value: string) => {
    if (value === '') {
      setFixedExpenses(fixedExpenses.map(e => 
        e.name === expenseName ? { ...e, amount: 0 } : e
      ));
      setExpenseAmountErrors({ ...expenseAmountErrors, [expenseName]: 'Enter amount for this expense.' });
      return;
    }

    const numericRegex = /^[0-9]+$/;
    if (numericRegex.test(value)) {
      setFixedExpenses(fixedExpenses.map(e => 
        e.name === expenseName ? { ...e, amount: parseInt(value, 10) } : e
      ));
      const newErrors = { ...expenseAmountErrors };
      delete newErrors[expenseName];
      setExpenseAmountErrors(newErrors);
    } else {
      setExpenseAmountErrors({ ...expenseAmountErrors, [expenseName]: 'Numbers only.' });
    }
  };

  // Format expense amount on blur
  const handleExpenseAmountBlur = (expenseName: string, amount: number) => {
    // Formatting is handled in the display
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    // Check all required fields
    if (!employmentType) return false;
    if (!monthlySalary) return false;
    if (!primaryIncomeSource) return false;
    if (fixedExpenses.length === 0) return false;
    if (!emiCount) return false;
    if (!investmentValue) return false;
    if (!creditScore) return false;
    if (!dependents) return false;
    
    // Check for validation errors
    if (salaryError || emiError || investmentError || creditScoreError || dependentsError) return false;
    
    // Check fixed expenses have amounts
    for (const expense of fixedExpenses) {
      if (expense.amount === 0) return false;
    }
    
    // Check for expense amount errors
    if (Object.keys(expenseAmountErrors).length > 0) return false;
    
    return true;
  };

  // Validate all fields on mount and updates
  useEffect(() => {
    // Validate employment type
    if (touched.employmentType && !employmentType) {
      setEmploymentTypeError('This field is required.');
    } else {
      setEmploymentTypeError('');
    }

    // Validate salary
    if (touched.salary && !monthlySalary) {
      setSalaryError('This field is required.');
    }

    // Validate primary income
    if (touched.primaryIncome && !primaryIncomeSource) {
      setPrimaryIncomeError('This field is required.');
    } else {
      setPrimaryIncomeError('');
    }

    // Validate fixed expenses
    if (touched.fixedExpenses && fixedExpenses.length === 0) {
      setFixedExpensesError('Add at least one fixed expense.');
    } else {
      setFixedExpensesError('');
    }

    // Validate EMI
    if (touched.emi && !emiCount) {
      setEmiError('This field is required.');
    }

    // Validate investment
    if (touched.investment && !investmentValue) {
      setInvestmentError('This field is required.');
    }

    // Validate dependents
    if (touched.dependents && !dependents) {
      setDependentsError('This field is required.');
    }
  }, [employmentType, monthlySalary, primaryIncomeSource, fixedExpenses, emiCount, investmentValue, creditScore, dependents, touched]);

  const handleContinue = async () => {
    // Mark all fields as touched
    setTouched({
      employmentType: true,
      salary: true,
      primaryIncome: true,
      fixedExpenses: true,
      emi: true,
      investment: true,
      creditScore: true,
      dependents: true,
    });

    // Validate all fields
    if (!isFormValid()) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields correctly.');
      return;
    }

    setIsLoading(true);

    try {
      // Save profile data
      const profileData = {
        employmentType,
        monthlySalary: parseInt(monthlySalary, 10),
        primaryIncomeSource,
        secondaryIncomeSource,
        fixedExpenses,
        emiCount: parseInt(emiCount, 10),
        investmentValue: parseInt(investmentValue, 10),
        creditScore: parseInt(creditScore, 10),
        dependents: parseInt(dependents, 10),
      };

      await AsyncStorage.setItem('@peso_profile_data', JSON.stringify(profileData));
      await AsyncStorage.setItem('@peso_profile_setup_complete', 'true');

      // The AppNavigator will automatically detect this change via polling
      // and transition to the main app (no manual navigation needed)
      
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <UserCircle size={40} color={colors.buttonGreen} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Complete Your Financial Profile</Text>
          <Text style={styles.subtitle}>
            All fields are required to personalize your experience.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* 1. Employment Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Employment Type <Text style={styles.required}>*</Text></Text>
            <TouchableOpacity
              style={[
                styles.dropdown,
                touched.employmentType && !employmentType && styles.errorBorder
              ]}
              onPress={() => {
                setShowEmploymentPicker(!showEmploymentPicker);
                setTouched({ ...touched, employmentType: true });
              }}
            >
              <Text style={[styles.dropdownText, !employmentType && styles.placeholder]}>
                {employmentType || 'Select Employment Type'}
              </Text>
              <ChevronDown size={20} color="#6B6B6B" />
            </TouchableOpacity>
            {touched.employmentType && employmentTypeError ? (
              <Text style={styles.errorText}>{employmentTypeError}</Text>
            ) : null}
            {showEmploymentPicker && (
              <View style={styles.pickerContainer}>
                <ScrollView style={styles.pickerScroll} nestedScrollEnabled>
                  {EMPLOYMENT_TYPES.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.pickerItem}
                      onPress={() => {
                        setEmploymentType(item);
                        setShowEmploymentPicker(false);
                        setEmploymentTypeError('');
                      }}
                    >
                      <Text style={styles.pickerItemText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* 2. Monthly Salary */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Monthly Salary <Text style={styles.required}>*</Text></Text>
            <View style={[
              styles.inputWithPrefix,
              touched.salary && salaryError && styles.errorBorder
            ]}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter monthly salary"
                placeholderTextColor="#9A9A9A"
                keyboardType="numeric"
                value={monthlySalaryDisplay || monthlySalary}
                onFocus={() => {
                  setMonthlySalaryDisplay('');
                }}
                onChangeText={(value) => {
                  const cleaned = value.replace(/,/g, '');
                  validateNumericInput(cleaned, setMonthlySalary, setSalaryError);
                }}
                onBlur={handleSalaryBlur}
              />
            </View>
            {touched.salary && salaryError ? <Text style={styles.errorText}>{salaryError}</Text> : null}
          </View>

          {/* 3. Primary Income Source */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Primary Income Source <Text style={styles.required}>*</Text></Text>
            <TouchableOpacity
              style={[
                styles.dropdown,
                touched.primaryIncome && !primaryIncomeSource && styles.errorBorder
              ]}
              onPress={() => {
                setShowIncomePicker(!showIncomePicker);
                setTouched({ ...touched, primaryIncome: true });
              }}
            >
              <Text style={[styles.dropdownText, !primaryIncomeSource && styles.placeholder]}>
                {primaryIncomeSource || 'Select primary income source'}
              </Text>
              <ChevronDown size={20} color="#6B6B6B" />
            </TouchableOpacity>
            {touched.primaryIncome && primaryIncomeError ? (
              <Text style={styles.errorText}>{primaryIncomeError}</Text>
            ) : null}
            {showIncomePicker && (
              <View style={styles.pickerContainer}>
                {PRIMARY_INCOME_SOURCES.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.pickerItem}
                    onPress={() => {
                      setPrimaryIncomeSource(item);
                      setShowIncomePicker(false);
                      setPrimaryIncomeError('');
                    }}
                  >
                    <Text style={styles.pickerItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* 4. Secondary Income Source (Optional) */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Secondary Income Source (Optional)</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Optional (freelance, rental, side job)"
              placeholderTextColor="#9A9A9A"
              value={secondaryIncomeSource}
              onChangeText={setSecondaryIncomeSource}
            />
          </View>

          {/* 5. Fixed Expenses (Tag Input with Amount) */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Fixed Expenses <Text style={styles.required}>*</Text></Text>
            <Text style={styles.helperText}>Add at least one expense with amount</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add expense (e.g., Rent, Bills)"
                placeholderTextColor="#9A9A9A"
                value={currentExpenseInput}
                onChangeText={setCurrentExpenseInput}
                onSubmitEditing={addFixedExpense}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.addButton} onPress={addFixedExpense}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            {touched.fixedExpenses && fixedExpensesError ? (
              <Text style={styles.errorText}>{fixedExpensesError}</Text>
            ) : null}
            {fixedExpenses.length > 0 && (
              <View style={styles.expensesListContainer}>
                {fixedExpenses.map((expense, index) => (
                  <View key={index} style={styles.expenseItem}>
                    <View style={styles.expenseTag}>
                      <Text style={styles.expenseTagText}>{expense.name}</Text>
                      <TouchableOpacity onPress={() => removeFixedExpense(expense.name)}>
                        <X size={14} color="#6B6B6B" />
                      </TouchableOpacity>
                    </View>
                    <View style={[
                      styles.expenseAmountContainer,
                      expense.amount === 0 && styles.errorBorder
                    ]}>
                      <Text style={styles.expenseAmountPrefix}>₹</Text>
                      <TextInput
                        style={styles.expenseAmountInput}
                        placeholder="Amount"
                        placeholderTextColor="#9A9A9A"
                        keyboardType="numeric"
                        value={expense.amount > 0 ? formatIndianNumber(expense.amount) : ''}
                        onFocus={(e) => {
                          // Show raw number on focus
                          if (expense.amount > 0) {
                            e.currentTarget.setNativeProps({ text: expense.amount.toString() });
                          }
                        }}
                        onChangeText={(value) => {
                          const cleaned = value.replace(/,/g, '');
                          updateExpenseAmount(expense.name, cleaned);
                        }}
                        onBlur={() => {
                          setTouched({ ...touched, fixedExpenses: true });
                        }}
                      />
                    </View>
                    {expenseAmountErrors[expense.name] && (
                      <Text style={styles.expenseErrorText}>{expenseAmountErrors[expense.name]}</Text>
                    )}
                    {expense.amount === 0 && !expenseAmountErrors[expense.name] && (
                      <Text style={styles.expenseErrorText}>Enter amount for this expense.</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* 6. Variable Expenses (Disabled) */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Variable Expenses</Text>
            <TextInput
              style={[styles.inputField, styles.disabledInput]}
              placeholder="Collected automatically later"
              placeholderTextColor="#BDBDBD"
              editable={false}
            />
          </View>

          {/* 7. EMI Count */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>EMI Count <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[
                styles.inputField,
                touched.emi && emiError && styles.errorBorder
              ]}
              placeholder="Number of active EMIs"
              placeholderTextColor="#9A9A9A"
              keyboardType="numeric"
              value={emiCount}
              onChangeText={(value) => validateNumericInput(value, setEmiCount, setEmiError)}
              onBlur={() => setTouched({ ...touched, emi: true })}
            />
            {touched.emi && emiError ? <Text style={styles.errorText}>{emiError}</Text> : null}
          </View>

          {/* 8. Invested in Stocks/Mutual Funds/Bonds */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Invested in Stocks / Mutual Funds / Bonds <Text style={styles.required}>*</Text></Text>
            <View style={[
              styles.inputWithPrefix,
              touched.investment && investmentError && styles.errorBorder
            ]}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                style={styles.input}
                placeholder="Total current investment value"
                placeholderTextColor="#9A9A9A"
                keyboardType="numeric"
                value={investmentValueDisplay || investmentValue}
                onFocus={() => {
                  setInvestmentValueDisplay('');
                }}
                onChangeText={(value) => {
                  const cleaned = value.replace(/,/g, '');
                  validateNumericInput(cleaned, setInvestmentValue, setInvestmentError);
                }}
                onBlur={handleInvestmentBlur}
              />
            </View>
            {touched.investment && investmentError ? <Text style={styles.errorText}>{investmentError}</Text> : null}
          </View>

          {/* 9. Credit Score */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Credit Score <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[
                styles.inputField,
                touched.creditScore && creditScoreError && styles.errorBorder
              ]}
              placeholder="Enter credit score (300-850)"
              placeholderTextColor="#9A9A9A"
              keyboardType="numeric"
              value={creditScore}
              onChangeText={validateCreditScore}
              onBlur={() => setTouched({ ...touched, creditScore: true })}
            />
            {touched.creditScore && creditScoreError ? <Text style={styles.errorText}>{creditScoreError}</Text> : null}
          </View>

          {/* 10. Dependents Count */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Dependents Count <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[
                styles.inputField,
                touched.dependents && dependentsError && styles.errorBorder
              ]}
              placeholder="Number of dependents (0-10)"
              placeholderTextColor="#9A9A9A"
              keyboardType="numeric"
              value={dependents}
              onChangeText={(value) => {
                if (value === '') {
                  setDependents('');
                  setDependentsError('This field is required.');
                  return;
                }
                const numericRegex = /^[0-9]+$/;
                if (!numericRegex.test(value)) {
                  setDependentsError('Numbers only.');
                  return;
                }
                const num = parseInt(value, 10);
                if (num < 0 || num > 10) {
                  setDependentsError('Must be between 0 and 10.');
                } else {
                  setDependentsError('');
                }
                setDependents(value);
              }}
              onBlur={() => setTouched({ ...touched, dependents: true })}
            />
            {touched.dependents && dependentsError ? <Text style={styles.errorText}>{dependentsError}</Text> : null}
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !isFormValid() && styles.continueButtonDisabled,
            isLoading && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!isFormValid() || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 28,
  },
  fieldContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  required: {
    color: '#FF6B6B',
  },
  helperText: {
    fontSize: 12,
    color: '#6B6B6B',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 52,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  placeholder: {
    color: '#9A9A9A',
  },
  errorBorder: {
    borderColor: '#FF6B6B',
    borderWidth: 1.5,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pickerScroll: {
    maxHeight: 200,
  },
  pickerItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  inputWithPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 52,
    paddingHorizontal: 18,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  inputField: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 52,
  },
  disabledInput: {
    backgroundColor: '#F9F9F9',
    color: '#BDBDBD',
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 52,
  },
  addButton: {
    backgroundColor: '#32D483',
    borderRadius: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  expensesListContainer: {
    marginTop: 12,
    gap: 12,
  },
  expenseItem: {
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    padding: 12,
  },
  expenseTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  expenseTagText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  expenseAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 44,
    paddingHorizontal: 12,
  },
  expenseAmountPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 6,
  },
  expenseAmountInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  expenseErrorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  continueButton: {
    backgroundColor: '#32D483',
    borderRadius: 32,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#32D483',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#CFCFCF',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
