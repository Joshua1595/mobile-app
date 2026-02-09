
export type RiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk';

export interface PatientData {
  heart_rate: number;
  body_temperature: number;
  age: number;
  weight_kg: number;
  height_m: number;
  gender: 'male' | 'female';
  patient_id: number;
}

export interface PredictionResponse {
  predicted_risk: RiskLevel;
  bmi: number;
  probabilities: {
    low: number;
    medium: number;
    high: number;
  };
  note: string;
  alert: boolean;
  source: 'medical_rule' | 'ml_model';
  explanation: {
    feature: string;
    importance: number;
  }[];
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  isLoggedIn: boolean;
}

export interface HistoryItem extends PredictionResponse {
  heart_rate: number;
  body_temperature: number;
}
