import { GoogleGenAI, Type } from "@google/genai";
import { PatientData, PredictionResponse, RiskLevel } from "../types";

/**
 * Simulates the /predict endpoint logic described in the prompt.
 * It combines hard medical rules with AI-driven insights.
 */
export async function getPrediction(data: PatientData): Promise<PredictionResponse> {
  const bmi = parseFloat((data.weight_kg / (data.height_m * data.height_m)).toFixed(1));
  
  // 1. Initial Medical Rules (FastAPI logic simulation)
  let risk: RiskLevel = 'Low Risk';
  let alert = false;
  let source: 'medical_rule' | 'ml_model' = 'medical_rule';

  if (data.heart_rate > 120 || data.body_temperature > 39 || (data.heart_rate > 100 && bmi > 30)) {
    risk = 'High Risk';
    alert = true;
  } else if (data.heart_rate > 90 || data.body_temperature > 37.5 || bmi > 25) {
    risk = 'Medium Risk';
  }

  // 2. Enhance with Gemini for detailed explanation and probabilistic breakdown
  // (In a real scenario, this would be the FastAPI backend's internal ML model)
  try {
    // Fix: Instantiate GoogleGenAI right before the call using the exact process.env.API_KEY reference
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      // Fix: Using 'gemini-3-pro-preview' for complex medical reasoning and explanation tasks
      model: 'gemini-3-pro-preview',
      contents: `Patient Data: ${JSON.stringify(data)}. BMI: ${bmi}. 
                Analyze this medical data and return a JSON object with:
                - probabilistic breakdown (low, medium, high probabilities summing to 1.0)
                - a short medical note
                - feature importance (explanation) for heart_rate, bmi, and temperature.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            probabilities: {
              type: Type.OBJECT,
              properties: {
                low: { type: Type.NUMBER },
                medium: { type: Type.NUMBER },
                high: { type: Type.NUMBER }
              },
              required: ['low', 'medium', 'high']
            },
            note: { type: Type.STRING },
            explanation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  importance: { type: Type.NUMBER }
                },
                required: ['feature', 'importance']
              }
            }
          },
          required: ['probabilities', 'note', 'explanation']
        }
      }
    });

    // Fix: Extracting text using the .text property as defined in guidelines
    const aiResult = JSON.parse(response.text || '{}');
    
    return {
      predicted_risk: risk,
      bmi,
      probabilities: aiResult.probabilities || { low: 0.8, medium: 0.1, high: 0.1 },
      note: aiResult.note || "Standard monitoring active.",
      alert,
      source: alert ? 'medical_rule' : 'ml_model',
      explanation: aiResult.explanation || [],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("AI enrichment failed, falling back to basic mock", error);
    return {
      predicted_risk: risk,
      bmi,
      probabilities: { low: 0.7, medium: 0.2, high: 0.1 },
      note: "Monitoring vital signs. BMI is slightly elevated.",
      alert,
      source: 'medical_rule',
      explanation: [{ feature: 'heart_rate', importance: 0.8 }, { feature: 'bmi', importance: 0.5 }],
      timestamp: new Date().toISOString()
    };
  }
}