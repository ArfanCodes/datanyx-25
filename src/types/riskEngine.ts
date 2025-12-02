export interface RiskInputData {
  employment_type: string;
  monthly_salary: number;
  fixed_expenses: number;
  variable_expenses: number | null;
  emi_count: number;
  invested_value: number;
  credit_score: number;
  dependents_count: number;
}

export interface EngineeredFeatures {
  total_emi_outflow: number;
  monthly_burn_cost: number;
  savings_ratio: number;
  debt_stress_index: number;
  financial_runway_months: number;
}

export interface RiskPredictionResponse {
  risk_category: 'High Risk' | 'Moderate Risk' | 'Low Risk';
  probabilities: {
    [key: string]: number;
  };
}
