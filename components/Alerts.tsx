
import React, { useState, useEffect } from 'react';
import { PredictionResponse } from '../types';

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<PredictionResponse[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vguard_alerts');
    if (saved) setAlerts(JSON.parse(saved));
  }, []);

  const clearAlerts = () => {
    localStorage.removeItem('vguard_alerts');
    setAlerts([]);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      <header className="px-6 py-8 bg-white border-b border-slate-50 flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Active Alerts</h2>
        <button onClick={clearAlerts} className="text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors">
          Clear Logs
        </button>
      </header>

      <div className="p-5 space-y-4">
        {alerts.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-800 font-bold">System Status: Clear</p>
            <p className="text-slate-400 text-xs mt-1">No critical incidents detected in the last session.</p>
          </div>
        ) : (
          alerts.map((alert, idx) => (
            <div key={idx} className="bg-white p-5 rounded-3xl border-l-4 border-rose-500 shadow-sm animate-slideIn">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black uppercase text-rose-500 tracking-tighter bg-rose-50 px-2 py-0.5 rounded">Critical Incident</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-slate-900 font-black text-lg mb-2">{alert.predicted_risk}</p>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">"{alert.note}"</p>
              <div className="pt-3 border-t border-slate-50 flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span> BMI {alert.bmi}</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span> SRC {alert.source}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
