import { useState, useCallback } from 'react';
import { RiskInputData, EngineeredFeatures, RiskPredictionResponse } from '../types/riskEngine';
import { useRiskStore } from '../store/riskStore';
import { calculateStabilityScore } from '../utils/riskUtils';

const API_URL = process.env.EXPO_PUBLIC_RISK_API_URL || 'https://finstability-api-v2-120470301005.asia-south1.run.app/predict_risk';

export const useRiskEngine = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskResult, setRiskResult] = useState<RiskPredictionResponse | null>(null);
  const [engineeredFeatures, setEngineeredFeatures] = useState<EngineeredFeatures | null>(null);

  const calculateFeatures = (data: RiskInputData): { features: EngineeredFeatures; processedData: RiskInputData } => {
    let {
      monthly_salary,
      fixed_expenses,
      variable_expenses,
      emi_count,
      invested_value,
      employment_type,
      credit_score,
      dependents_count,
    } = data;

    // 2. Apply safeguards for variable_expenses
    if (variable_expenses === null || variable_expenses === undefined) {
      if (monthly_salary < 40000) {
        variable_expenses = monthly_salary * 0.25;
      } else if (monthly_salary >= 40000 && monthly_salary <= 80000) {
        variable_expenses = monthly_salary * 0.20;
      } else {
        variable_expenses = monthly_salary * 0.18;
      }
    }

    // 3. Compute engineered features
    const total_emi_outflow = emi_count * 12000;
    const monthly_burn_cost = fixed_expenses + variable_expenses + total_emi_outflow;
    
    // Avoid division by zero
    const savings_ratio = monthly_salary > 0 
      ? (monthly_salary - monthly_burn_cost) / monthly_salary 
      : 0;
      
    const debt_stress_index = monthly_salary > 0 
      ? total_emi_outflow / monthly_salary 
      : 0;
      
    const financial_runway_months = (fixed_expenses + 1) > 0 
      ? invested_value / (fixed_expenses + 1) 
      : 0;

    const features: EngineeredFeatures = {
      total_emi_outflow,
      monthly_burn_cost,
      savings_ratio,
      debt_stress_index,
      financial_runway_months,
    };

    const processedData: RiskInputData = {
      employment_type,
      monthly_salary,
      fixed_expenses,
      variable_expenses,
      emi_count,
      invested_value,
      credit_score,
      dependents_count,
    };

    return { features, processedData };
  };

  const predictRisk = useCallback(async (data: RiskInputData) => {
    setLoading(true);
    setError(null);

    try {
      const { features, processedData } = calculateFeatures(data);
      setEngineeredFeatures(features);

      // Calculate Stability Score
      const stabilityScore = calculateStabilityScore(features, processedData.monthly_salary);

      // 4. Build the JSON EXACTLY in the requested format
      const payload = {
        Employment_Type: processedData.employment_type,
        Monthly_Salary: processedData.monthly_salary,
        Fixed_Expenses: processedData.fixed_expenses,
        Variable_Expenses: processedData.variable_expenses,
        EMI_Count: processedData.emi_count,
        Total_EMI_Outflow: features.total_emi_outflow,
        Invested_Value: processedData.invested_value,
        Credit_Score: processedData.credit_score,
        Dependents_Count: processedData.dependents_count,
      };

      // 5. POST to API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result: RiskPredictionResponse = await response.json();
      setRiskResult(result);

      // Update Global Store
      useRiskStore.getState().setRiskData(result, features, stabilityScore);

      return result;

    } catch (err) {
      console.error('Risk prediction failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    predictRisk,
    riskResult,
    engineeredFeatures,
    loading,
    error,
  };
};
