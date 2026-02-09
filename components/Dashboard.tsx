
import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PatientData, PredictionResponse, HistoryItem } from '../types';
import { getPrediction } from '../services/predictionService';

interface DashboardProps {
  onLogout: () => void;
  isLive: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, isLive }) => {
  const [vitals, setVitals] = useState<PatientData>({
    heart_rate: 72,
    body_temperature: 36.6,
    age: 35,
    weight_kg: 80,
    height_m: 1.8,
    gender: 'male',
    patient_id: 12345
  });

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPrediction = useCallback(async (data: PatientData) => {
    setLoading(true);
    const result = await getPrediction(data);
    setPrediction(result);
    setLoading(false);

    // Save to history
    const history: HistoryItem[] = JSON.parse(localStorage.getItem('vguard_history') || '[]');
    const newHistoryItem: HistoryItem = { ...result, heart_rate: data.heart_rate, body_temperature: data.body_temperature };
    localStorage.setItem('vguard_history', JSON.stringify([newHistoryItem, ...history].slice(0, 50)));

    // Handle high risk alerts
    if (result.alert) {
      const alerts: PredictionResponse[] = JSON.parse(localStorage.getItem('vguard_alerts') || '[]');
      localStorage.setItem('vguard_alerts', JSON.stringify([result, ...alerts].slice(0, 20)));
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("VitalGuard Alert: High Risk Detected!", { body: result.note });
      }
    }
  }, []);

  useEffect(() => {
    fetchPrediction(vitals);
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (isLive) {
      interval = setInterval(() => {
        setVitals(prev => {
          const hrDelta = Math.floor(Math.random() * 7) - 3;
          const tempDelta = (Math.random() * 0.3) - 0.15;
          const newVitals = {
            ...prev,
            heart_rate: Math.max(60, Math.min(180, prev.heart_rate + hrDelta)),
            body_temperature: parseFloat(Math.max(35, Math.min(41, prev.body_temperature + tempDelta)).toFixed(1))
          };
          fetchPrediction(newVitals);
          return newVitals;
        });
      }, 6000); 
    }
    return () => clearInterval(interval);
  }, [isLive, fetchPrediction]);

  const riskColors = {
    'Low Risk': 'bg-emerald-500',
    'Medium Risk': 'bg-amber-500',
    'High Risk': 'bg-rose-500'
  };

  const probData = prediction ? [
    { name: 'Low', value: prediction.probabilities.low, color: '#10b981' },
    { name: 'Med', value: prediction.probabilities.medium, color: '#f59e0b' },
    { name: 'High', value: prediction.probabilities.high, color: '#f43f5e' }
  ] : [];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-white flex justify-between items-center border-b border-slate-50">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Overview</h2>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {isLive ? 'Real-time active' : 'Simulation paused'}
            </span>
          </div>
        </div>
        <button onClick={onLogout} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-100 shadow-sm">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>

      {/* Main Risk Display */}
      <div className="px-5 py-4">
        <div className={`rounded-3xl p-6 ${prediction ? riskColors[prediction.predicted_risk] : 'bg-slate-300'} transition-all duration-700 shadow-2xl shadow-blue-100 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">Risk Assessment</p>
              <h3 className="text-white text-3xl font-black tracking-tight">
                {loading && !prediction ? 'Scanning...' : prediction?.predicted_risk}
              </h3>
            </div>
            <div className={`w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30`}>
              {prediction?.alert ? (
                <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>
          {prediction && (
            <div className="mt-5 pt-4 border-t border-white/20">
              <p className="text-white text-xs leading-relaxed font-medium">"{prediction.note}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-5 grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm transition-transform active:scale-95">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pulse</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">{vitals.heart_rate}</span>
            <span className="text-xs font-bold text-slate-400">BPM</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm transition-transform active:scale-95">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temp</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">{vitals.body_temperature}</span>
            <span className="text-xs font-bold text-slate-400">°C</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm col-span-2 flex justify-between items-center border-l-4 border-l-blue-500">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Body Mass Index</p>
            <span className="text-3xl font-black text-slate-900">{prediction?.bmi || '--'}</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-300 uppercase mb-2">Health Grade</p>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${prediction?.bmi && prediction.bmi > 25 ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
              {prediction?.bmi ? (prediction.bmi > 30 ? 'High Risk' : prediction.bmi > 25 ? 'Warning' : 'Optimal') : '...'}
            </span>
          </div>
        </div>
      </div>

      {/* Probabilities Section */}
      <div className="px-5 py-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            AI Confidence
          </h4>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={probData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={6} dataKey="value">
                  {probData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between px-2 mt-2">
            {probData.map(d => (
              <div key={d.name} className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: d.color }}></div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{d.name}</p>
                <p className="text-xs font-black text-slate-700">{(d.value * 100).toFixed(0)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="px-5 pb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Influencing Factors
            </h4>
          </div>
          <div className="space-y-5">
            {prediction?.explanation.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span className="text-slate-500">{exp.feature.replace('_', ' ')}</span>
                  <span className="text-blue-600">{(exp.importance * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                  <div className="bg-blue-600 h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(37,99,235,0.4)]" style={{ width: `${exp.importance * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
