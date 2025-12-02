import { create } from 'zustand';
import { EngineeredFeatures, RiskPredictionResponse } from '../types/riskEngine';

interface RiskState {
  riskResult: RiskPredictionResponse | null;
  engineeredFeatures: EngineeredFeatures | null;
  stabilityScore: number;
  setRiskData: (result: RiskPredictionResponse | null, features: EngineeredFeatures | null, score: number) => void;
}

export const useRiskStore = create<RiskState>((set) => ({
  riskResult: null,
  engineeredFeatures: null,
  stabilityScore: 0,
  setRiskData: (result, features, score) => set({ 
    riskResult: result, 
    engineeredFeatures: features, 
    stabilityScore: score 
  }),
}));
