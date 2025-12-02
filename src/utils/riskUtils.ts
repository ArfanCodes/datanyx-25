import { EngineeredFeatures } from '../types/riskEngine';

export const calculateStabilityScore = (
  engineeredFeatures: EngineeredFeatures,
  monthlySalary: number
): number => {
  const { monthly_burn_cost, savings_ratio, debt_stress_index } = engineeredFeatures;
  
  let score = 0;
  
  // 1. Savings Ratio (30 points)
  // Ideal > 20%
  score += Math.min(savings_ratio * 100 * 1.5, 30);

  // 2. Debt Stress (30 points)
  // Ideal < 30%
  const debtScore = Math.max(0, 30 - (debt_stress_index * 100));
  score += debtScore;

  // 3. Burn Rate Coverage (40 points)
  // Income should cover burn cost comfortably
  const coverage = monthlySalary > 0 ? (monthlySalary - monthly_burn_cost) / monthlySalary : 0;
  const coverageScore = Math.max(0, Math.min(40, coverage * 100));
  score += coverageScore;

  return Math.max(0, Math.min(100, Math.round(score)));
};
